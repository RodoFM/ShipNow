import express from 'express';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.js';

// Rutas
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/products.routes.js';
import mockRoutes from './routes/mocks.routes.js';

// Middleware de errores
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ── Middlewares generales ──
app.use(express.json());

// ── Rutas ──
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/mocks', mockRoutes);

app.get('/', (req, res) => {
  res.json({
    message: `ShipNow API v1 - corriendo en modo ${config.nodeEnv}`,
    version: '1.0.0',
  });
});

// ── Middleware de errores──
app.use(errorHandler);

// ── Conexión a DB y arranque del servidor ──
connectDB();

app.listen(config.port, () => {
  console.log(` Servidor corriendo en el puerto ${config.port}`);
});