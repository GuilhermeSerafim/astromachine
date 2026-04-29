// ==========================================
// AstroMachine Server - Rotas de Servicos
// ==========================================

import { Router, Request, Response } from 'express';
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
    res.status(404).json({ error: 'Servico nao encontrado.' });
    return;
  }
  res.json(service);
});

// POST /services (admin only)
router.post('/', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const { name, description, price, estimatedHours, category } = req.body;

  if (!name || !description || price === undefined) {
    res.status(400).json({ error: 'Nome, descricao e preco sao obrigatorios.' });
    return;
  }

  const newService = db.createService({
    name,
    description,
    price: Number(price),
    estimatedHours: Number(estimatedHours) || 1,
    category: category || 'geral',
  });

  res.status(201).json(newService);
});

// PUT /services/:id (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const updatedService = db.updateService(req.params.id, req.body);
  if (!updatedService) {
    res.status(404).json({ error: 'Servico nao encontrado.' });
    return;
  }

  res.json(updatedService);
});

// DELETE /services/:id (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response): void => {
  const deleted = db.deleteService(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Servico nao encontrado.' });
    return;
  }

  res.status(204).send();
});

export default router;
