// ==========================================
// AstroMachine Server - Rota de Checkout (simulação)
// ==========================================

import { Router, Response } from 'express';
import { db } from '../services/database';
import { authMiddleware, AuthRequest } from '../middlewares/auth';
import { OrderItem } from '../models/types';

const router = Router();

// POST /checkout/simulate
router.post('/simulate', authMiddleware, (req: AuthRequest, res: Response): void => {
  const { items, paymentMethod, cardLastFour } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'O carrinho está vazio.' });
    return;
  }

  if (!paymentMethod) {
    res.status(400).json({ error: 'Método de pagamento é obrigatório.' });
    return;
  }

  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = db.findProductById(item.productId);
    if (!product) {
      res.status(400).json({ error: `Produto ${item.productId} não encontrado.` });
      return;
    }

    const orderItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity || 1,
      unitPrice: product.price,
    };

    totalAmount += orderItem.unitPrice * orderItem.quantity;
    orderItems.push(orderItem);
  }

  const order = db.createOrder({
    userId: req.user!.userId,
    items: orderItems,
    totalAmount,
    status: 'confirmed' as const,
    paymentMethod: paymentMethod + (cardLastFour ? ` (**** ${cardLastFour})` : ''),
  });

  // Simular um delay de "processamento"
  res.status(201).json({
    message: 'Pedido confirmado com sucesso! (simulação)',
    order,
  });
});

export default router;
