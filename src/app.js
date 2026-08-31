// APP.JS — Solo configura la app Express (rutas, middlewares, docs).
// NO llama a connectDB() ni a app.listen().
// Esto permite importar la app en tests sin abrir un puerto real.
import express from 'express';
import { config } from './config/index.js';
import { setupSwagger } from './docs/swagger.js';

// Rutas
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/products.routes.js';
import mockRoutes from './routes/mocks.routes.js';
import loggerRoutes from './routes/logger.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Middlewares
import { errorHandler } from './middlewares/error.middleware.js';
import {
  requestLogger,
  notFoundHandler,
} from './middlewares/requestLogger.middleware.js';

const app = express();

// ── Middlewares generales ──
app.use(express.json());
app.use(requestLogger);

// ── Documentación Swagger / OpenAPI ── disponible en /api/docs
setupSwagger(app);

// ── Rutas ──
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/logger-test', loggerRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.json({
    message: `ShipNow API v1 - corriendo en modo ${config.nodeEnv}`,
    version: '1.0.0',
  });
});

// ── Ruta inexistente (404) ── 
app.use(notFoundHandler);

// ── Middleware de errores ── 
app.use(errorHandler);

export default app;