'use strict';

// Run after `npm run build`. Uses the installed driver and disposable synthetic
// SQLite files only. Never imports the HTTP entry point or opens an existing DB.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const tables = ['users', 'products', 'services', 'appointments', 'appointment_services', 'orders', 'order_items'];
const expectedCounts = [2, 6, 5, 2, 3, 0, 0];
const syntheticConfig = {
  ENABLE_DEMO_SEED: 'true', NODE_ENV: 'development',
  DEMO_ADMIN_EMAIL: ' Synthetic.Admin@example.invalid ',
  DEMO_CLIENT_EMAIL: 'synthetic.client@example.invalid',
  DEMO_ADMIN_PASSWORD: ' synthetic-admin-password-only ',
  DEMO_CLIENT_PASSWORD: ' synthetic-client-password-only ',
};

function clearSeedEnvironment() {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('DEMO_') || key.startsWith('ASTROMACHINE_') || key === 'ENABLE_DEMO_SEED' || key === 'NODE_ENV') delete process.env[key];
  }
}

function runCase(name, directory) {
  assert(path.isAbsolute(directory));
  clearSeedEnvironment();
  // The singleton import is explicitly directed to a new disposable database
  // with seed disabled. Only the database module is loaded, never index.ts.
  process.env.ENABLE_DEMO_SEED = 'false';
  process.env.ASTROMACHINE_DB_PATH = path.join(directory, 'singleton.sqlite');
  globalThis.fetch = () => { throw new Error('Network is not part of this test'); };
  const BetterSqlite3 = require('better-sqlite3');
  const bcrypt = require('bcryptjs');
  const { Database, db } = require('../dist/services/database.js');
  db.close();
  const file = path.join(directory, 'case.sqlite');
  const counts = () => {
    const connection = new BetterSqlite3(file, { readonly: true });
    try {
      const result = tables.map((table) => connection.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n);
      assert.equal(connection.pragma('foreign_key_check').length, 0);
      return result;
    } finally { connection.close(); }
  };
  const assertEmpty = () => assert.deepEqual(counts(), tables.map(() => 0));
  const success = () => {
    const database = new Database(file);
    try {
      assert.deepEqual(counts(), expectedCounts);
      assert(database.users.some((user) => user.email === syntheticConfig.DEMO_ADMIN_EMAIL.trim()));
      for (const role of ['admin', 'client']) {
        const user = database.users.find((candidate) => candidate.role === role);
        const password = syntheticConfig[`DEMO_${role.toUpperCase()}_PASSWORD`];
        assert(bcrypt.compareSync(password, user.password));
        assert(!bcrypt.compareSync(password.trim(), user.password), 'Password whitespace must be preserved');
      }
    } finally { database.close(); }
  };

  if (name === 'default-off' || name === 'explicit-off') {
    clearSeedEnvironment();
    if (name === 'explicit-off') Object.assign(process.env, syntheticConfig, { ENABLE_DEMO_SEED: 'false' });
    const database = new Database(file); database.close(); assertEmpty();
  } else if (name === 'existing-user-preserved') {
    const initial = new Database(file);
    const existing = initial.createUser({ name: 'Synthetic existing account', email: 'existing@example.invalid', password: bcrypt.hashSync('synthetic-existing-password', 4), role: 'client' });
    initial.createProduct({ name: 'Synthetic existing product', description: '', price: 1, imageUrl: '', category: 'synthetic', specs: '', inStock: true });
    initial.close();
    clearSeedEnvironment();
    // Invalid seed configuration must not modify or reset a populated database.
    process.env.ENABLE_DEMO_SEED = 'true'; process.env.NODE_ENV = 'production';
    const reopened = new Database(file);
    try {
      const current = reopened.users[0];
      assert(['id', 'name', 'email', 'password', 'role', 'createdAt'].every((key) => current[key] === existing[key]));
      assert.deepEqual(counts(), [1, 1, 0, 0, 0, 0, 0]);
    } finally { reopened.close(); }
  } else if (name === 'success-and-reopen') {
    Object.assign(process.env, syntheticConfig); success();
    const reopened = new Database(file); reopened.close();
    assert.deepEqual(counts(), expectedCounts);
  } else if (name.startsWith('fail:')) {
    const [, table, ordinalText] = name.split(':');
    const ordinal = Number(ordinalText);
    assert(tables.includes(table) && Number.isInteger(ordinal) && ordinal > 0);
    const initial = new Database(file); initial.close();
    const control = new BetterSqlite3(file);
    control.exec(`CREATE TRIGGER synthetic_failure BEFORE INSERT ON ${table}
      WHEN (SELECT COUNT(*) FROM ${table}) = ${ordinal - 1}
      BEGIN SELECT RAISE(ABORT, 'synthetic-insert-failure'); END;`);
    control.close();
    Object.assign(process.env, syntheticConfig);
    assert.throws(() => new Database(file), /synthetic-insert-failure/);
    assertEmpty();
    const retryControl = new BetterSqlite3(file);
    retryControl.exec('DROP TRIGGER synthetic_failure'); retryControl.close();
    // A failure inside a nested appointment transaction must leave a clean retry.
    success();
  } else {
    Object.assign(process.env, syntheticConfig);
    if (name === 'production-rejected') process.env.NODE_ENV = 'production';
    else if (name === 'duplicate-trim-rejected') process.env.DEMO_CLIENT_EMAIL = syntheticConfig.DEMO_ADMIN_EMAIL.trim();
    else if (name === 'duplicate-case-rejected') process.env.DEMO_CLIENT_EMAIL = syntheticConfig.DEMO_ADMIN_EMAIL.trim().toUpperCase();
    else if (name.startsWith('missing:')) delete process.env[name.slice('missing:'.length)];
    else if (name.startsWith('blank:')) process.env[name.slice('blank:'.length)] = '  ';
    else throw new Error('Unknown synthetic test case');
    assert.throws(() => new Database(file), /Demo seeding|Missing server-only|distinct email/);
    assertEmpty();
  }
  const connection = new BetterSqlite3(file, { readonly: true });
  const sqliteVersion = connection.prepare('SELECT sqlite_version() AS version').get().version;
  connection.close();
  return { case: name, passed: true, sqliteVersion, driverVersion: require('better-sqlite3/package.json').version };
}

if (process.argv[2] === '--case') {
  try { process.stdout.write(JSON.stringify(runCase(process.argv[3], process.argv[4]))); }
  catch (error) {
    // No values, rows, credential fields or assertion diffs in the receipt.
    process.stdout.write(JSON.stringify({ case: process.argv[3], passed: false, errorType: error.name }));
    process.exitCode = 1;
  }
} else {
  const { test } = require('node:test');
  const fields = ['DEMO_ADMIN_EMAIL', 'DEMO_CLIENT_EMAIL', 'DEMO_ADMIN_PASSWORD', 'DEMO_CLIENT_PASSWORD'];
  const cases = ['default-off', 'explicit-off', 'production-rejected', ...fields.map((key) => `missing:${key}`), ...fields.map((key) => `blank:${key}`), 'duplicate-trim-rejected', 'duplicate-case-rejected', 'success-and-reopen', 'existing-user-preserved'];
  for (const [table, count] of [['users', 2], ['products', 6], ['services', 5], ['appointments', 2], ['appointment_services', 3]]) {
    for (let ordinal = 1; ordinal <= count; ordinal += 1) cases.push(`fail:${table}:${ordinal}`);
  }
  const root = process.env.ASTRO_TEST_ROOT || os.tmpdir();
  fs.mkdirSync(root, { recursive: true });
  for (const name of cases) {
    test(`real SQLite: ${name}`, { concurrency: false }, () => {
      const directory = fs.mkdtempSync(path.join(root, 'astro-seed-'));
      const env = { ...process.env };
      for (const key of Object.keys(env)) {
        if (key.startsWith('DEMO_') || key.startsWith('ASTROMACHINE_') || key === 'ENABLE_DEMO_SEED' || key === 'NODE_ENV') delete env[key];
      }
      const child = spawnSync(process.execPath, [__filename, '--case', name, directory], { env, encoding: 'utf8', timeout: 20000, windowsHide: true });
      assert.equal(child.status, 0, `Synthetic case failed: ${name}; details omitted`);
      const result = JSON.parse(child.stdout);
      assert.equal(result.passed, true);
      // Files are intentionally left under the temporary root for inspection;
      // each child exit closes all handles, including failed constructors.
    });
  }
}
