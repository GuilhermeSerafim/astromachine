import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { Database } from './database';

let tempDirs: string[] = [];

function createTempDatabase() {
  const dir = mkdtempSync(path.join(tmpdir(), 'astromachine-db-'));
  tempDirs.push(dir);
  return path.join(dir, 'astromachine-test.db');
}

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

describe('Database SQLite persistence', () => {
  it('seeds and reopens persisted products', () => {
    const dbPath = createTempDatabase();
    const firstDb = new Database(dbPath);

    expect(firstDb.products.length).toBeGreaterThanOrEqual(6);
    const product = firstDb.createProduct({
      name: 'Build Teste Persistente',
      description: 'Produto criado no teste para validar persistencia.',
      price: 4321.99,
      imageUrl: '',
      category: 'teste',
      specs: 'RTX Test | CPU Test',
      inStock: true,
    });
    firstDb.close();

    const reopenedDb = new Database(dbPath);
    expect(reopenedDb.findProductById(product.id)).toMatchObject({
      id: product.id,
      name: 'Build Teste Persistente',
      price: 4321.99,
      category: 'teste',
      inStock: true,
    });
    reopenedDb.close();
  });

  it('updates and deletes products in SQLite', () => {
    const dbPath = createTempDatabase();
    const database = new Database(dbPath);
    const product = database.createProduct({
      name: 'Build Temporaria',
      description: 'Produto temporario.',
      price: 100,
      imageUrl: '',
      category: 'temporario',
      specs: 'Specs',
      inStock: true,
    });

    const updated = database.updateProduct(product.id, {
      name: 'Build Atualizada',
      price: 250,
      inStock: false,
    });
    expect(updated).toMatchObject({
      id: product.id,
      name: 'Build Atualizada',
      price: 250,
      inStock: false,
    });

    expect(database.deleteProduct(product.id)).toBe(true);
    expect(database.findProductById(product.id)).toBeUndefined();
    database.close();
  });

  it('deletes a seeded product even when it is referenced by an appointment', () => {
    const dbPath = createTempDatabase();
    const database = new Database(dbPath);
    const referencedAppointment = database.appointments.find((appointment) => appointment.productId);

    expect(referencedAppointment?.productId).toBeDefined();
    expect(database.deleteProduct(referencedAppointment!.productId!)).toBe(true);
    expect(database.findProductById(referencedAppointment!.productId!)).toBeUndefined();
    expect(database.appointments.find((appointment) => appointment.id === referencedAppointment!.id)?.productId).toBeUndefined();
    database.close();
  });

  it('deletes a seeded service even when it is referenced by an appointment', () => {
    const dbPath = createTempDatabase();
    const database = new Database(dbPath);
    const referencedServiceId = database.appointments.find((appointment) => appointment.serviceIds.length > 0)
      ?.serviceIds[0];

    expect(referencedServiceId).toBeDefined();
    expect(database.deleteService(referencedServiceId!)).toBe(true);
    expect(database.findServiceById(referencedServiceId!)).toBeUndefined();
    expect(database.appointments.some((appointment) => appointment.serviceIds.includes(referencedServiceId!))).toBe(
      false
    );
    database.close();
  });

  it('creates orders and exposes dashboard data', () => {
    const dbPath = createTempDatabase();
    const database = new Database(dbPath);
    const product = database.products[0];
    const user = database.findUserByEmail('guilherme@email.com');

    expect(user).toBeDefined();

    const order = database.createOrder({
      userId: user!.id,
      items: [
        {
          productId: product.id,
          productName: product.name,
          quantity: 2,
          unitPrice: product.price,
        },
      ],
      totalAmount: product.price * 2,
      status: 'confirmed',
      paymentMethod: 'PIX',
    });

    const dashboard = database.getDashboardData();
    expect(order.items).toHaveLength(1);
    expect(dashboard.summary.totalProducts).toBeGreaterThanOrEqual(6);
    expect(dashboard.summary.totalOrders).toBe(1);
    expect(dashboard.summary.revenue).toBe(product.price * 2);
    expect(dashboard.products.byCategory.length).toBeGreaterThan(0);
    expect(dashboard.records.products.length).toBeGreaterThanOrEqual(6);
    expect(dashboard.records.services.length).toBeGreaterThanOrEqual(5);
    expect(dashboard.records.orders[0]).toMatchObject({ id: order.id });
    expect(dashboard.records.appointments.length).toBeGreaterThanOrEqual(2);
    expect(dashboard.orders.recent[0]).toMatchObject({
      id: order.id,
      totalAmount: product.price * 2,
      status: 'confirmed',
    });
    database.close();
  });
});
