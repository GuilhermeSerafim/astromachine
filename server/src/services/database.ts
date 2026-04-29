// ==========================================
// AstroMachine Server - Banco SQLite
// ==========================================

import fs from 'fs';
import path from 'path';
import BetterSqlite3 from 'better-sqlite3';
import type { Database as SqliteDatabase } from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { Appointment, Order, OrderItem, Product, Service, User } from '../models/types';

type CreateUserInput = Omit<User, 'id' | 'createdAt'> & Partial<Pick<User, 'id' | 'createdAt'>>;
type CreateProductInput = Omit<Product, 'id' | 'createdAt'> & Partial<Pick<Product, 'id' | 'createdAt'>>;
type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt'>>;
type CreateServiceInput = Omit<Service, 'id' | 'createdAt'> & Partial<Pick<Service, 'id' | 'createdAt'>>;
type UpdateServiceInput = Partial<Omit<Service, 'id' | 'createdAt'>>;
type CreateAppointmentInput = Omit<Appointment, 'id' | 'createdAt'> & Partial<Pick<Appointment, 'id' | 'createdAt'>>;
type CreateOrderInput = Omit<Order, 'id' | 'createdAt'> & Partial<Pick<Order, 'id' | 'createdAt'>>;

interface UserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
  createdAt: string;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  specs: string;
  inStock: number;
  createdAt: string;
}

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedHours: number;
  category: string;
  createdAt: string;
}

interface AppointmentRow {
  id: string;
  userId: string;
  productId: string | null;
  date: string;
  status: Appointment['status'];
  notes: string;
  createdAt: string;
}

interface OrderRow {
  id: string;
  userId: string;
  totalAmount: number;
  status: Order['status'];
  paymentMethod: string;
  createdAt: string;
}

interface OrderItemRow {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface DashboardData {
  generatedAt: string;
  summary: {
    totalProducts: number;
    totalServices: number;
    totalUsers: number;
    totalOrders: number;
    revenue: number;
    productsInStock: number;
    productsOutOfStock: number;
  };
  products: {
    byCategory: Array<{ category: string; total: number; averagePrice: number }>;
    priceRange: { min: number; max: number; average: number };
  };
  services: {
    byCategory: Array<{ category: string; total: number; averagePrice: number }>;
  };
  orders: {
    byPaymentMethod: Array<{ paymentMethod: string; total: number; revenue: number }>;
    recent: Array<Pick<Order, 'id' | 'userId' | 'totalAmount' | 'status' | 'paymentMethod' | 'createdAt'>>;
  };
  records: {
    products: Product[];
    services: Service[];
    appointments: Appointment[];
    orders: Order[];
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function toProduct(row: ProductRow): Product {
  return {
    ...row,
    inStock: Boolean(row.inStock),
  };
}

function toAppointment(row: AppointmentRow, serviceIds: string[]): Appointment {
  return {
    id: row.id,
    userId: row.userId,
    productId: row.productId || undefined,
    serviceIds,
    date: row.date,
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt,
  };
}

function defaultDatabasePath(): string {
  return path.resolve(process.env.ASTROMACHINE_DB_PATH || path.join(process.cwd(), 'data', 'astromachine.db'));
}

export class Database {
  private connection: SqliteDatabase;

  constructor(databasePath = defaultDatabasePath()) {
    const dir = path.dirname(databasePath);
    fs.mkdirSync(dir, { recursive: true });
    this.connection = new BetterSqlite3(databasePath);
    this.connection.pragma('foreign_keys = ON');
    this.init();
    this.seed();
  }

  get users(): User[] {
    return this.connection.prepare('SELECT * FROM users ORDER BY createdAt ASC').all() as User[];
  }

  get products(): Product[] {
    const rows = this.connection.prepare('SELECT * FROM products ORDER BY createdAt ASC').all() as ProductRow[];
    return rows.map(toProduct);
  }

  get services(): Service[] {
    return this.connection.prepare('SELECT * FROM services ORDER BY createdAt ASC').all() as Service[];
  }

  get appointments(): Appointment[] {
    const rows = this.connection.prepare('SELECT * FROM appointments ORDER BY createdAt ASC').all() as AppointmentRow[];
    return rows.map((row) => toAppointment(row, this.getAppointmentServiceIds(row.id)));
  }

  get orders(): Order[] {
    const rows = this.connection.prepare('SELECT * FROM orders ORDER BY createdAt ASC').all() as OrderRow[];
    return rows.map((row) => ({
      ...row,
      items: this.getOrderItems(row.id),
    }));
  }

  close(): void {
    this.connection.close();
  }

  findUserByEmail(email: string): User | undefined {
    const row = this.connection.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
    return row;
  }

  findUserById(id: string): User | undefined {
    const row = this.connection.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
    return row;
  }

  createUser(input: CreateUserInput): User {
    const user: User = {
      id: input.id || uuid(),
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      createdAt: input.createdAt || nowIso(),
    };

    this.connection
      .prepare(
        `INSERT INTO users (id, name, email, password, role, createdAt)
         VALUES (@id, @name, @email, @password, @role, @createdAt)`
      )
      .run(user);
    return user;
  }

  findProductById(id: string): Product | undefined {
    const row = this.connection.prepare('SELECT * FROM products WHERE id = ?').get(id) as ProductRow | undefined;
    return row ? toProduct(row) : undefined;
  }

  createProduct(input: CreateProductInput): Product {
    const product: Product = {
      id: input.id || uuid(),
      name: input.name,
      description: input.description,
      price: Number(input.price),
      imageUrl: input.imageUrl || '',
      category: input.category || 'geral',
      specs: input.specs || '',
      inStock: input.inStock ?? true,
      createdAt: input.createdAt || nowIso(),
    };

    this.connection
      .prepare(
        `INSERT INTO products (id, name, description, price, imageUrl, category, specs, inStock, createdAt)
         VALUES (@id, @name, @description, @price, @imageUrl, @category, @specs, @inStock, @createdAt)`
      )
      .run({ ...product, inStock: product.inStock ? 1 : 0 });
    return product;
  }

  updateProduct(id: string, input: UpdateProductInput): Product | undefined {
    const current = this.findProductById(id);
    if (!current) {
      return undefined;
    }

    const next: Product = { ...current, ...input, price: input.price !== undefined ? Number(input.price) : current.price };
    this.connection
      .prepare(
        `UPDATE products
         SET name = @name,
             description = @description,
             price = @price,
             imageUrl = @imageUrl,
             category = @category,
             specs = @specs,
             inStock = @inStock
         WHERE id = @id`
      )
      .run({ ...next, inStock: next.inStock ? 1 : 0 });
    return next;
  }

  deleteProduct(id: string): boolean {
    const remove = this.connection.transaction(() => {
      this.connection.prepare('UPDATE appointments SET productId = NULL WHERE productId = ?').run(id);
      this.connection.prepare('DELETE FROM order_items WHERE productId = ?').run(id);
      const result = this.connection.prepare('DELETE FROM products WHERE id = ?').run(id);
      return result.changes > 0;
    });
    return remove();
  }

  findServiceById(id: string): Service | undefined {
    const row = this.connection.prepare('SELECT * FROM services WHERE id = ?').get(id) as ServiceRow | undefined;
    return row;
  }

  createService(input: CreateServiceInput): Service {
    const service: Service = {
      id: input.id || uuid(),
      name: input.name,
      description: input.description,
      price: Number(input.price),
      estimatedHours: Number(input.estimatedHours) || 1,
      category: input.category || 'geral',
      createdAt: input.createdAt || nowIso(),
    };

    this.connection
      .prepare(
        `INSERT INTO services (id, name, description, price, estimatedHours, category, createdAt)
         VALUES (@id, @name, @description, @price, @estimatedHours, @category, @createdAt)`
      )
      .run(service);
    return service;
  }

  updateService(id: string, input: UpdateServiceInput): Service | undefined {
    const current = this.findServiceById(id);
    if (!current) {
      return undefined;
    }

    const next: Service = {
      ...current,
      ...input,
      price: input.price !== undefined ? Number(input.price) : current.price,
      estimatedHours:
        input.estimatedHours !== undefined ? Number(input.estimatedHours) || 1 : current.estimatedHours,
    };
    this.connection
      .prepare(
        `UPDATE services
         SET name = @name,
             description = @description,
             price = @price,
             estimatedHours = @estimatedHours,
             category = @category
         WHERE id = @id`
      )
      .run(next);
    return next;
  }

  deleteService(id: string): boolean {
    const remove = this.connection.transaction(() => {
      this.connection.prepare('DELETE FROM appointment_services WHERE serviceId = ?').run(id);
      const result = this.connection.prepare('DELETE FROM services WHERE id = ?').run(id);
      return result.changes > 0;
    });
    return remove();
  }

  createAppointment(input: CreateAppointmentInput): Appointment {
    const appointment: Appointment = {
      id: input.id || uuid(),
      userId: input.userId,
      productId: input.productId,
      serviceIds: input.serviceIds || [],
      date: input.date,
      status: input.status,
      notes: input.notes || '',
      createdAt: input.createdAt || nowIso(),
    };

    const insert = this.connection.transaction(() => {
      this.connection
        .prepare(
          `INSERT INTO appointments (id, userId, productId, date, status, notes, createdAt)
           VALUES (@id, @userId, @productId, @date, @status, @notes, @createdAt)`
        )
        .run({ ...appointment, productId: appointment.productId || null });

      const insertService = this.connection.prepare(
        `INSERT INTO appointment_services (appointmentId, serviceId) VALUES (?, ?)`
      );
      for (const serviceId of appointment.serviceIds) {
        insertService.run(appointment.id, serviceId);
      }
    });

    insert();
    return appointment;
  }

  createOrder(input: CreateOrderInput): Order {
    const order: Order = {
      id: input.id || uuid(),
      userId: input.userId,
      items: input.items,
      totalAmount: Number(input.totalAmount),
      status: input.status,
      paymentMethod: input.paymentMethod,
      createdAt: input.createdAt || nowIso(),
    };

    const insert = this.connection.transaction(() => {
      this.connection
        .prepare(
          `INSERT INTO orders (id, userId, totalAmount, status, paymentMethod, createdAt)
           VALUES (@id, @userId, @totalAmount, @status, @paymentMethod, @createdAt)`
        )
        .run({
          id: order.id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
        });

      const insertItem = this.connection.prepare(
        `INSERT INTO order_items (id, orderId, productId, productName, quantity, unitPrice)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      for (const item of order.items) {
        insertItem.run(uuid(), order.id, item.productId, item.productName, item.quantity, item.unitPrice);
      }
    });

    insert();
    return order;
  }

  getDashboardData(): DashboardData {
    const summary = this.connection
      .prepare(
        `SELECT
          (SELECT COUNT(*) FROM products) AS totalProducts,
          (SELECT COUNT(*) FROM services) AS totalServices,
          (SELECT COUNT(*) FROM users) AS totalUsers,
          (SELECT COUNT(*) FROM orders) AS totalOrders,
          (SELECT COALESCE(SUM(totalAmount), 0) FROM orders) AS revenue,
          (SELECT COUNT(*) FROM products WHERE inStock = 1) AS productsInStock,
          (SELECT COUNT(*) FROM products WHERE inStock = 0) AS productsOutOfStock`
      )
      .get() as DashboardData['summary'];

    const productPriceRange =
      (this.connection
        .prepare(
          `SELECT
            COALESCE(MIN(price), 0) AS min,
            COALESCE(MAX(price), 0) AS max,
            COALESCE(AVG(price), 0) AS average
           FROM products`
        )
        .get() as DashboardData['products']['priceRange']) || { min: 0, max: 0, average: 0 };

    const productsByCategory = this.connection
      .prepare(
        `SELECT category, COUNT(*) AS total, COALESCE(AVG(price), 0) AS averagePrice
         FROM products
         GROUP BY category
         ORDER BY total DESC, category ASC`
      )
      .all() as DashboardData['products']['byCategory'];

    const servicesByCategory = this.connection
      .prepare(
        `SELECT category, COUNT(*) AS total, COALESCE(AVG(price), 0) AS averagePrice
         FROM services
         GROUP BY category
         ORDER BY total DESC, category ASC`
      )
      .all() as DashboardData['services']['byCategory'];

    const ordersByPaymentMethod = this.connection
      .prepare(
        `SELECT paymentMethod, COUNT(*) AS total, COALESCE(SUM(totalAmount), 0) AS revenue
         FROM orders
         GROUP BY paymentMethod
         ORDER BY revenue DESC, paymentMethod ASC`
      )
      .all() as DashboardData['orders']['byPaymentMethod'];

    const recentOrders = this.connection
      .prepare(
        `SELECT id, userId, totalAmount, status, paymentMethod, createdAt
         FROM orders
         ORDER BY createdAt DESC
         LIMIT 10`
      )
      .all() as DashboardData['orders']['recent'];

    return {
      generatedAt: nowIso(),
      summary,
      products: {
        byCategory: productsByCategory,
        priceRange: productPriceRange,
      },
      services: {
        byCategory: servicesByCategory,
      },
      orders: {
        byPaymentMethod: ordersByPaymentMethod,
        recent: recentOrders,
      },
      records: {
        products: this.products,
        services: this.services,
        appointments: this.appointments,
        orders: this.orders,
      },
    };
  }

  private init(): void {
    this.connection.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'client')),
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'geral',
        specs TEXT NOT NULL DEFAULT '',
        inStock INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        estimatedHours INTEGER NOT NULL DEFAULT 1,
        category TEXT NOT NULL DEFAULT 'geral',
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        productId TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        notes TEXT NOT NULL DEFAULT '',
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS appointment_services (
        appointmentId TEXT NOT NULL,
        serviceId TEXT NOT NULL,
        PRIMARY KEY (appointmentId, serviceId),
        FOREIGN KEY (appointmentId) REFERENCES appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'delivered')),
        paymentMethod TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);
  }

  private seed(): void {
    const usersCount = this.connection.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number };
    if (usersCount.count > 0) {
      return;
    }

    const seedTime = nowIso();
    const adminId = uuid();
    const clientId = uuid();

    this.createUser({
      id: adminId,
      name: 'Admin AstroMachine',
      email: 'admin@astromachine.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      createdAt: seedTime,
    });

    this.createUser({
      id: clientId,
      name: 'Guilherme Cliente',
      email: 'guilherme@email.com',
      password: bcrypt.hashSync('cliente123', 10),
      role: 'client',
      createdAt: seedTime,
    });

    const products = [
      {
        name: 'Build Andromeda',
        description:
          'PC gamer de alto desempenho com tematica da galaxia Andromeda. RTX 4070, Ryzen 7 7800X3D, 32GB DDR5.',
        price: 8999.9,
        category: 'high-end',
        specs: 'RTX 4070 | Ryzen 7 7800X3D | 32GB DDR5 | 1TB NVMe | Water Cooler 240mm',
      },
      {
        name: 'PC Orion',
        description:
          'Workstation robusta inspirada na constelacao de Orion. Ideal para criadores de conteudo e streamers.',
        price: 12499.9,
        category: 'workstation',
        specs: 'RTX 4080 | Ryzen 9 7950X | 64GB DDR5 | 2TB NVMe | Custom Loop',
      },
      {
        name: 'Nebula Prime',
        description: 'Build intermediaria com visual nebuloso e LEDs RGB sincronizados.',
        price: 5999.9,
        category: 'mid-range',
        specs: 'RTX 4060 Ti | Ryzen 5 7600X | 16GB DDR5 | 512GB NVMe | Air Cooler',
      },
      {
        name: 'Exoplaneta X',
        description: 'Setup compacto Mini-ITX com design futurista inspirado em exoplanetas.',
        price: 7499.9,
        category: 'compact',
        specs: 'RTX 4070 | Ryzen 7 7700X | 32GB DDR5 | 1TB NVMe | Mini-ITX Case',
      },
      {
        name: 'Supernova Elite',
        description: 'O top de linha da AstroMachine. Performance explosiva com componentes de ponta.',
        price: 19999.9,
        category: 'extreme',
        specs: 'RTX 4090 | Ryzen 9 7950X3D | 128GB DDR5 | 4TB NVMe | Custom Loop Hardline',
      },
      {
        name: 'Cosmos Starter',
        description: 'Entrada ideal para quem esta comecando no universo gamer.',
        price: 3499.9,
        category: 'entry',
        specs: 'RTX 4060 | Ryzen 5 5600 | 16GB DDR4 | 512GB NVMe | Air Cooler',
      },
    ].map((product) => this.createProduct({ ...product, imageUrl: '', inStock: true, createdAt: seedTime }));

    const services = [
      {
        name: 'Pintura Galaxia',
        description: 'Pintura aerografada personalizada com tematica de galaxias e nebulosas no gabinete.',
        price: 899.9,
        estimatedHours: 48,
        category: 'visual',
      },
      {
        name: 'RGB Cosmico',
        description: 'Instalacao de sistema de iluminacao RGB sincronizado com efeitos de aurora.',
        price: 349.9,
        estimatedHours: 4,
        category: 'iluminacao',
      },
      {
        name: 'Gravacao Lunar',
        description: 'Gravacao a laser personalizada em paineis laterais com motivos lunares.',
        price: 599.9,
        estimatedHours: 24,
        category: 'personalizacao',
      },
      {
        name: 'Montagem Premium',
        description: 'Servico de montagem completa com cable management profissional e teste de estresse.',
        price: 499.9,
        estimatedHours: 8,
        category: 'montagem',
      },
      {
        name: 'Overclock Estelar',
        description: 'Ajuste fino de overclock em CPU e GPU com monitoramento termico.',
        price: 299.9,
        estimatedHours: 6,
        category: 'performance',
      },
    ].map((service) => this.createService({ ...service, createdAt: seedTime }));

    this.createAppointment({
      userId: clientId,
      productId: products[0].id,
      serviceIds: [services[0].id, services[1].id],
      date: '2026-04-15T14:00:00.000Z',
      status: 'confirmed',
      notes: 'Cliente deseja pintura estilo Via Lactea com RGB combinando.',
      createdAt: seedTime,
    });

    this.createAppointment({
      userId: clientId,
      productId: products[2].id,
      serviceIds: [services[3].id],
      date: '2026-04-20T10:00:00.000Z',
      status: 'pending',
      notes: 'Montagem basica com teste de estresse.',
      createdAt: seedTime,
    });
  }

  private getAppointmentServiceIds(appointmentId: string): string[] {
    const rows = this.connection
      .prepare('SELECT serviceId FROM appointment_services WHERE appointmentId = ? ORDER BY serviceId ASC')
      .all(appointmentId) as Array<{ serviceId: string }>;
    return rows.map((row) => row.serviceId);
  }

  private getOrderItems(orderId: string): OrderItem[] {
    return this.connection
      .prepare(
        `SELECT productId, productName, quantity, unitPrice
         FROM order_items
         WHERE orderId = ?
         ORDER BY productName ASC`
      )
      .all(orderId) as OrderItem[];
  }
}

export const db = new Database();
