import express from 'express';
import { config } from './config/env.config.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

// Rutas
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/products.routes.js';
import mockRoutes from './routes/mocks.routes.js';
import loggerRoutes from './routes/logger.routes.js';

// Middlewares
import { errorHandler } from './middlewares/error.middleware.js';
import {
  requestLogger,
  notFoundHandler,
} from './middlewares/requestLogger.middleware.js';

const app = express();

// ── Middlewares generales ──
app.use(express.json());
app.use(requestLogger); // registra cada request (nivel http)

// ── Rutas ──
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/logger-test', loggerRoutes); // endpoint de prueba del logger

app.get('/', (req, res) => {
  res.json({
    message: `ShipNow API v1 - corriendo en modo ${config.nodeEnv}`,
    version: '1.0.0',
  });
});

// ── Ruta inexistente (404) ── va después de las rutas, antes del errorHandler
app.use(notFoundHandler);

// ── Middleware de errores ── SIEMPRE al final
app.use(errorHandler);

// ── Conexión a DB y arranque del servidor ──
connectDB();

app.listen(config.port, () => {
  logger.info(`Servidor ShipNow escuchando en el puerto ${config.port}`);
});