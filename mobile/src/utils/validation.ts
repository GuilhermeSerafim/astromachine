// ==========================================
// AstroMachine Mobile - Validação com Zod
// ==========================================

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  price: z.string().min(1, 'Preço é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  specs: z.string().optional(),
});

export const checkoutSchema = z.object({
  cardName: z.string().min(2, 'Nome no cartão é obrigatório'),
  cardNumber: z.string().min(16, 'Número do cartão inválido').max(19, 'Número do cartão inválido'),
  expiry: z.string().min(5, 'Validade é obrigatória'),
  cvv: z.string().min(3, 'CVV é obrigatório').max(4, 'CVV inválido'),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProductForm = z.infer<typeof productSchema>;
export type CheckoutForm = z.infer<typeof checkoutSchema>;
