import logger from '../config/logger.js';
import { NotFoundError } from '../errors/index.js';

// ── Registra cada request entrante con nivel 'http' ──
// Ejemplo de log: 2026-08-01 10:12:03 [http]     GET /api/users
export const requestLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
};

// ── Handler para rutas inexistentes (404) ──
// Va DESPUÉS de todas las rutas y ANTES del errorHandler.
// Lanza un NotFoundError que el middleware de errores registrará y responderá.
export const notFoundHandler = (req, res, next) => {
  logger.warning(`Ruta inexistente: ${req.method} ${req.originalUrl}`);
  next(
    new NotFoundError(
      `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      'ROUTE_NOT_FOUND'
    )
  );
};