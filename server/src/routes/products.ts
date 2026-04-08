// ==========================================
// AstroMachine Server - Rotas de Produtos
// ==========================================

import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../services/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

// GET /products
router.get('/', (_req: Request, res: Response): void => {
  res.json(db.products);
});

// GET /products/:id
router.get('/:id', (req: Request, res: Response): void => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Produto não encontrado.' });
    return;
  }
  res.json(product);
});

// POST /products (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const { name, description, price, imageUrl, category, specs } = req.body;

  if (!name || !description || price === undefined) {
    res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios.' });
    return;
  }

  const newProduct = {
    id: uuid(),
    name,
    description,
    price: Number(price),
    imageUrl: imageUrl || 'https://via.placeholder.com/400x300/1a1a2e/e0e0ff?text=Novo+Produto',
    category: category || 'geral',
    specs: specs || '',
    inStock: true,
    createdAt: new Date().toISOString(),
  };

  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Produto não encontrado.' });
    return;
  }

  const { name, description, price, imageUrl, category, specs, inStock } = req.body;
  db.products[index] = {
    ...db.products[index],
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price: Number(price) }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(category !== undefined && { category }),
    ...(specs !== undefined && { specs }),
    ...(inStock !== undefined && { inStock }),
  };

  res.json(db.products[index]);
});

// DELETE /products/:id (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Produto não encontrado.' });
    return;
  }

  db.products.splice(index, 1);
  res.status(204).send();
});

export default router;
