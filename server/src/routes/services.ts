// ==========================================
// AstroMachine Server - Rotas de Serviços
// ==========================================

import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../services/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

// GET /services
router.get('/', (_req: Request, res: Response): void => {
  res.json(db.services);
});

// GET /services/:id
router.get('/:id', (req: Request, res: Response): void => {
  const service = db.findServiceById(req.params.id);
  if (!service) {
    res.status(404).json({ error: 'Serviço não encontrado.' });
    return;
  }
  res.json(service);
});

// POST /services (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const { name, description, price, estimatedHours, category } = req.body;

  if (!name || !description || price === undefined) {
    res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios.' });
    return;
  }

  const newService = {
    id: uuid(),
    name,
    description,
    price: Number(price),
    estimatedHours: Number(estimatedHours) || 1,
    category: category || 'geral',
    createdAt: new Date().toISOString(),
  };

  db.services.push(newService);
  res.status(201).json(newService);
});

// PUT /services/:id (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const index = db.services.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Serviço não encontrado.' });
    return;
  }

  const { name, description, price, estimatedHours, category } = req.body;
  db.services[index] = {
    ...db.services[index],
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price: Number(price) }),
    ...(estimatedHours !== undefined && { estimatedHours: Number(estimatedHours) }),
    ...(category !== undefined && { category }),
  };

  res.json(db.services[index]);
});

// DELETE /services/:id (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const index = db.services.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Serviço não encontrado.' });
    return;
  }

  db.services.splice(index, 1);
  res.status(204).send();
});

export default router;
