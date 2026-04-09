type SQLiteDatabase = {
  execAsync: (source: string) => Promise<void>;
  getFirstAsync: <T>(source: string) => Promise<T | null>;
};

let db: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!db) {
    const SQLite = await import('expo-sqlite');
    db = (await SQLite.openDatabaseAsync('astromachine.db')) as SQLiteDatabase;
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      category TEXT,
      specs TEXT,
      in_stock INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      estimated_hours INTEGER DEFAULT 1,
      category TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS appointment_services (
      appointment_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      PRIMARY KEY (appointment_id, service_id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_method TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM products');
  if (!result || result.count === 0) {
    await seedDatabase(database);
  }
}

async function seedDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    INSERT OR IGNORE INTO products (id, name, description, price, image_url, category, specs, in_stock) VALUES
    ('seed-prod-1', 'Build Andromeda', 'PC gamer de alto desempenho com tematica da galaxia Andromeda.', 8999.90, '', 'high-end', 'RTX 4070 | Ryzen 7 7800X3D | 32GB DDR5 | 1TB NVMe', 1),
    ('seed-prod-2', 'PC Orion', 'Workstation robusta inspirada na constelacao de Orion.', 12499.90, '', 'workstation', 'RTX 4080 | Ryzen 9 7950X | 64GB DDR5 | 2TB NVMe', 1),
    ('seed-prod-3', 'Nebula Prime', 'Build intermediaria com visual nebuloso e LEDs RGB.', 5999.90, '', 'mid-range', 'RTX 4060 Ti | Ryzen 5 7600X | 16GB DDR5 | 512GB NVMe', 1),
    ('seed-prod-4', 'Exoplaneta X', 'Setup compacto Mini-ITX com design futurista.', 7499.90, '', 'compact', 'RTX 4070 | Ryzen 7 7700X | 32GB DDR5 | 1TB NVMe', 1),
    ('seed-prod-5', 'Supernova Elite', 'O top de linha da AstroMachine.', 19999.90, '', 'extreme', 'RTX 4090 | Ryzen 9 7950X3D | 128GB DDR5 | 4TB NVMe', 1),
    ('seed-prod-6', 'Cosmos Starter', 'Entrada ideal para o universo gamer.', 3499.90, '', 'entry', 'RTX 4060 | Ryzen 5 5600 | 16GB DDR4 | 512GB NVMe', 1);

    INSERT OR IGNORE INTO services (id, name, description, price, estimated_hours, category) VALUES
    ('seed-svc-1', 'Pintura Galaxia', 'Pintura aerografada com tematica de galaxias.', 899.90, 48, 'visual'),
    ('seed-svc-2', 'RGB Cosmico', 'Instalacao de iluminacao RGB sincronizado.', 349.90, 4, 'iluminacao'),
    ('seed-svc-3', 'Gravacao Lunar', 'Gravacao a laser com motivos lunares.', 599.90, 24, 'personalizacao'),
    ('seed-svc-4', 'Montagem Premium', 'Montagem completa com cable management.', 499.90, 8, 'montagem'),
    ('seed-svc-5', 'Overclock Estelar', 'Ajuste fino de overclock em CPU e GPU.', 299.90, 6, 'performance');

    INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
    ('seed-admin-1', 'Admin AstroMachine', 'admin@astromachine.com', 'hashed', 'admin'),
    ('seed-client-1', 'Guilherme Cliente', 'guilherme@email.com', 'hashed', 'client');

    INSERT OR IGNORE INTO appointments (id, user_id, product_id, date, status, notes) VALUES
    ('seed-appt-1', 'seed-client-1', 'seed-prod-1', '2026-04-15T14:00:00', 'confirmed', 'Pintura Via Lactea com RGB'),
    ('seed-appt-2', 'seed-client-1', 'seed-prod-3', '2026-04-20T10:00:00', 'pending', 'Montagem basica');
  `);
}

export default { getDatabase };
