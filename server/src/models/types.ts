// ==========================================
// AstroMachine Server - Tipos
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hash
  role: 'admin' | 'client';
  createdAt: string;
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
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  paymentMethod: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutRequest {
  userId: string;
  items: CartItem[];
  paymentMethod: string;
  cardLastFour?: string;
}

export interface AuthPayload {
  userId: string;
  role: 'admin' | 'client';
}
