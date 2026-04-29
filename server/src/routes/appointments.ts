// ==========================================
// AstroMachine Server - Rotas de Agendamentos
// ==========================================

import { Router, Response } from 'express';
import { db } from '../services/database';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

// GET /appointments
router.get('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  if (req.user?.role === 'admin') {
    res.json(db.appointments);
    return;
  }
  const userAppointments = db.appointments.filter((a) => a.userId === req.user?.userId);
  res.json(userAppointments);
});

// POST /appointments
router.post('/', authMiddleware, (req: AuthRequest, res: Response): void => {
  const { productId, serviceIds, date, notes } = req.body;

  if (!date) {
    res.status(400).json({ error: 'Data do agendamento é obrigatória.' });
    return;
  }

  const newAppointment = db.createAppointment({
    userId: req.user!.userId,
    productId: productId || undefined,
    serviceIds: serviceIds || [],
    date,
    status: 'pending' as const,
    notes: notes || '',
  });

  res.status(201).json(newAppointment);
});

export default router;
