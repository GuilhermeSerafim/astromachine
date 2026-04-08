// ==========================================
// AstroMachine Mobile - Tipos do Domínio
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  specs: string;
  inStock: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedHours: number;
  category: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  productId?: string;
  serviceIds: string[];
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
