// ==========================================
// AstroMachine Server - Banco de dados em memória
// ==========================================

import { User, Product, Service, Appointment, Order } from '../models/types';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

class Database {
  users: User[] = [];
  products: Product[] = [];
  services: Service[] = [];
  appointments: Appointment[] = [];
  orders: Order[] = [];

  constructor() {
    this.seed();
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  seed() {
    // Usuários seed
    const adminPass = this.hashPassword('admin123');
    const clientPass = this.hashPassword('cliente123');

    this.users = [
      {
        id: uuid(),
        name: 'Admin AstroMachine',
        email: 'admin@astromachine.com',
        password: adminPass,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Guilherme Cliente',
        email: 'guilherme@email.com',
        password: clientPass,
        role: 'client',
        createdAt: new Date().toISOString(),
      },
    ];

    // Produtos seed - builds com tema espacial
    this.products = [
      {
        id: uuid(),
        name: 'Build Andromeda',
        description: 'PC gamer de alto desempenho com temática da galáxia Andrômeda. RTX 4070, Ryzen 7 7800X3D, 32GB DDR5.',
        price: 8999.90,
        imageUrl: '',
        category: 'high-end',
        specs: 'RTX 4070 | Ryzen 7 7800X3D | 32GB DDR5 | 1TB NVMe | Water Cooler 240mm',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'PC Orion',
        description: 'Workstation robusta inspirada na constelação de Orion. Ideal para criadores de conteúdo e streamers.',
        price: 12499.90,
        imageUrl: '',
        category: 'workstation',
        specs: 'RTX 4080 | Ryzen 9 7950X | 64GB DDR5 | 2TB NVMe | Custom Loop',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Nebula Prime',
        description: 'Build intermediária com visual nebuloso e LEDs RGB sincronizados. Perfeita para o gamer moderno.',
        price: 5999.90,
        imageUrl: '',
        category: 'mid-range',
        specs: 'RTX 4060 Ti | Ryzen 5 7600X | 16GB DDR5 | 512GB NVMe | Air Cooler',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Exoplaneta X',
        description: 'Setup compacto Mini-ITX com design futurista inspirado em exoplanetas. Portabilidade sem perder potência.',
        price: 7499.90,
        imageUrl: '',
        category: 'compact',
        specs: 'RTX 4070 | Ryzen 7 7700X | 32GB DDR5 | 1TB NVMe | Mini-ITX Case',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Supernova Elite',
        description: 'O top de linha da AstroMachine. Performance explosiva como uma supernova, com componentes de ponta.',
        price: 19999.90,
        imageUrl: '',
        category: 'extreme',
        specs: 'RTX 4090 | Ryzen 9 7950X3D | 128GB DDR5 | 4TB NVMe | Custom Loop Hardline',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Cosmos Starter',
        description: 'Entrada ideal para quem está começando no universo gamer. Custo-benefício estelar.',
        price: 3499.90,
        imageUrl: '',
        category: 'entry',
        specs: 'RTX 4060 | Ryzen 5 5600 | 16GB DDR4 | 512GB NVMe | Air Cooler',
        inStock: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Serviços seed
    this.services = [
      {
        id: uuid(),
        name: 'Pintura Galáxia',
        description: 'Pintura aerografada personalizada com temática de galáxias e nebulosas no gabinete.',
        price: 899.90,
        estimatedHours: 48,
        category: 'visual',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'RGB Cósmico',
        description: 'Instalação de sistema de iluminação RGB sincronizado com efeitos de aurora boreal e pulsação estelar.',
        price: 349.90,
        estimatedHours: 4,
        category: 'iluminação',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Gravação Lunar',
        description: 'Gravação a laser personalizada em painéis laterais com motivos lunares ou constelações à escolha.',
        price: 599.90,
        estimatedHours: 24,
        category: 'personalização',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Montagem Premium',
        description: 'Serviço de montagem completa com cable management profissional e teste de estresse de 72h.',
        price: 499.90,
        estimatedHours: 8,
        category: 'montagem',
        createdAt: new Date().toISOString(),
      },
      {
        id: uuid(),
        name: 'Overclock Estelar',
        description: 'Ajuste fino de overclock em CPU e GPU com monitoramento térmico e testes de estabilidade.',
        price: 299.90,
        estimatedHours: 6,
        category: 'performance',
        createdAt: new Date().toISOString(),
      },
    ];

    // Agendamentos seed
    if (this.users.length >= 2) {
      this.appointments = [
        {
          id: uuid(),
          userId: this.users[1].id,
          productId: this.products[0].id,
          serviceIds: [this.services[0].id, this.services[1].id],
          date: '2026-04-15T14:00:00.000Z',
          status: 'confirmed',
          notes: 'Cliente deseja pintura estilo Via Láctea com RGB combinando.',
          createdAt: new Date().toISOString(),
        },
        {
          id: uuid(),
          userId: this.users[1].id,
          productId: this.products[2].id,
          serviceIds: [this.services[3].id],
          date: '2026-04-20T10:00:00.000Z',
          status: 'pending',
          notes: 'Montagem básica com teste de estresse.',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  // Helpers
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  findServiceById(id: string): Service | undefined {
    return this.services.find((s) => s.id === id);
  }
}

// Singleton
export const db = new Database();
