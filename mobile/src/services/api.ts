// ==========================================
// AstroMachine Mobile - Serviço de API com Fallback
// ==========================================

import { Product, Service, AuthResponse, Appointment, Order } from '../types';
import { seedProducts, seedServices } from '../db/seedData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';
import { getApiBaseUrlCandidates } from './apiConfig';

const TIMEOUT_MS = 5000;
const API_PORT = '3001';

// Flag de disponibilidade da API
let apiAvailable = true;
let cachedApiBaseUrl: string | null = null;

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('auth_token');
}

function getBundleHost(): string | null {
  const scriptUrl = NativeModules?.SourceCode?.scriptURL;
  if (!scriptUrl || typeof scriptUrl !== 'string') {
    return null;
  }

  const hostMatch = scriptUrl.match(/^https?:\/\/([^/:]+)(?::\d+)?\//i);
  return hostMatch?.[1] ?? null;
}

function getExpoHost(): string | null {
  const candidates = [
    Constants?.expoConfig?.hostUri,
    Constants?.manifest2?.extra?.expoClient?.hostUri,
    Constants?.manifest2?.extra?.expoGo?.debuggerHost,
    Constants?.manifest?.debuggerHost,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !candidate.trim()) {
      continue;
    }

    const host = candidate.trim().split(':')[0];
    if (host) {
      return host;
    }
  }

  return null;
}

function getRuntimeApiCandidates(): string[] {
  const candidates = getApiBaseUrlCandidates({
    platformOS: Platform.OS,
    expoHost: getExpoHost(),
    bundleHost: getBundleHost(),
    envUrl: process.env.EXPO_PUBLIC_API_URL,
    port: API_PORT,
  });

  if (!cachedApiBaseUrl) {
    return candidates;
  }

  return [cachedApiBaseUrl, ...candidates.filter((candidate) => candidate !== cachedApiBaseUrl)];
}

async function fetchWithTimeout(path: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const token = await getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let lastError: unknown = null;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    for (const baseUrl of getRuntimeApiCandidates()) {
      try {
        const response = await fetch(`${baseUrl}${normalizedPath}`, {
          ...options,
          headers,
          signal: controller.signal,
        });
        cachedApiBaseUrl = baseUrl;
        apiAvailable = true;
        return response;
      } catch (error) {
        lastError = error;
      }
    }

    apiAvailable = false;
    throw lastError || new Error('API indisponivel');
  } catch (error) {
    apiAvailable = false;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// ========== AUTH ==========

export async function loginAPI(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetchWithTimeout('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erro no login');
    }
    return res.json();
  } catch (error) {
    // Fallback: login local simulado
    console.log('[Fallback] Usando login local');
    if (email === 'admin@astromachine.com' && password === 'admin123') {
      return {
        user: { id: 'admin-local-1', name: 'Admin AstroMachine', email, role: 'admin' },
        token: 'local-admin-token',
      };
    }
    if (email === 'guilherme@email.com' && password === 'cliente123') {
      return {
        user: { id: 'client-local-1', name: 'Guilherme Cliente', email, role: 'client' },
        token: 'local-client-token',
      };
    }
    throw new Error('Credenciais inválidas.');
  }
}

export async function registerAPI(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetchWithTimeout('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erro no cadastro');
    }
    return res.json();
  } catch (error) {
    if ((error as Error).message?.includes('cadastrado') || (error as Error).message?.includes('Erro no cadastro')) {
      throw error;
    }
    // Fallback: registro local simulado
    console.log('[Fallback] Usando registro local');
    return {
      user: { id: `local-${Date.now()}`, name, email, role: 'client' },
      token: 'local-new-token',
    };
  }
}

// ========== PRODUCTS ==========

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetchWithTimeout('/products');
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    return res.json();
  } catch {
    console.log('[Fallback] Usando produtos locais');
    return seedProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetchWithTimeout(`/products/${id}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    return res.json();
  } catch {
    return seedProducts.find((p) => p.id === id) || null;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetchWithTimeout('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erro ao criar produto');
    }
    return res.json();
  } catch (error) {
    // Fallback local
    const newProduct: Product = {
      id: `local-${Date.now()}`,
      name: product.name || 'Novo Produto',
      description: product.description || '',
      price: product.price || 0,
      imageUrl: product.imageUrl || '',
      category: product.category || 'geral',
      specs: product.specs || '',
      inStock: true,
      createdAt: new Date().toISOString(),
    };
    seedProducts.push(newProduct);
    return newProduct;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetchWithTimeout(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erro ao atualizar produto');
    }
    return res.json();
  } catch (error) {
    // Fallback local
    const idx = seedProducts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      seedProducts[idx] = { ...seedProducts[idx], ...product };
      return seedProducts[idx];
    }
    throw new Error('Produto não encontrado');
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const res = await fetchWithTimeout(`/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao excluir produto');
  } catch {
    // Fallback local
    const idx = seedProducts.findIndex((p) => p.id === id);
    if (idx >= 0) {
      seedProducts.splice(idx, 1);
    }
  }
}

// ========== SERVICES ==========

export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetchWithTimeout('/services');
    if (!res.ok) throw new Error('Erro ao buscar serviços');
    return res.json();
  } catch {
    console.log('[Fallback] Usando serviços locais');
    return seedServices;
  }
}

// ========== CHECKOUT ==========

export async function simulateCheckout(
  items: { productId: string; quantity: number }[],
  paymentMethod: string,
  cardLastFour?: string
): Promise<Order> {
  try {
    const res = await fetchWithTimeout('/checkout/simulate', {
      method: 'POST',
      body: JSON.stringify({ items, paymentMethod, cardLastFour }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erro no checkout');
    }
    const data = await res.json();
    return data.order;
  } catch {
    // Fallback: simulação local
    console.log('[Fallback] Checkout local simulado');
    const order: Order = {
      id: `order-local-${Date.now()}`,
      userId: 'local-user',
      items: items.map((i) => {
        const p = seedProducts.find((pr) => pr.id === i.productId);
        return {
          productId: i.productId,
          productName: p?.name || 'Produto',
          quantity: i.quantity,
          unitPrice: p?.price || 0,
        };
      }),
      totalAmount: items.reduce((sum, i) => {
        const p = seedProducts.find((pr) => pr.id === i.productId);
        return sum + (p?.price || 0) * i.quantity;
      }, 0),
      status: 'confirmed',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    return order;
  }
}

export function isAPIAvailable(): boolean {
  return apiAvailable;
}
