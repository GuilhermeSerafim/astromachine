// ==========================================
// AstroMachine Server - Rotas de Produtos
// ==========================================

import { Router, Request, Response } from 'express';
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
    res.status(404).json({ error: 'Produto nao encontrado.' });
    return;
  }
  res.json(product);
});

// POST /products (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const { name, description, price, imageUrl, category, specs, inStock } = req.body;

  if (!name || !description || price === undefined) {
    res.status(400).json({ error: 'Nome, descricao e preco sao obrigatorios.' });
    return;
  }

  const newProduct = db.createProduct({
    name,
    description,
    price: Number(price),
    imageUrl: imageUrl || '',
    category: category || 'geral',
    specs: specs || '',
    inStock: inStock ?? true,
  });

  res.status(201).json(newProduct);
});

// PUT /products/:id (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const updatedProduct = db.updateProduct(req.params.id, req.body);
  if (!updatedProduct) {
    res.status(404).json({ error: 'Produto nao encontrado.' });
    return;
  }

  res.json(updatedProduct);
});

// DELETE /products/:id (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Produto nao encontrado.' });
    return;
  }

  res.status(204).send();
});

export default router;
