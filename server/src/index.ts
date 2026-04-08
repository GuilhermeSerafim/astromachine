// ==========================================
// AstroMachine Server - Entry Point
// ==========================================

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';
import checkoutRoutes from './routes/checkout';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AstroMachine API', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/checkout', checkoutRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Inicialização
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`🚀 AstroMachine API rodando em http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

export default app;
