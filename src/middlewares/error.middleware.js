import { AppError } from '../errors/index.js';
import { config } from '../config/index.js';
import logger from '../config/logger.js';


// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// Este deberia ser el ÚNICO lugar donde se responden errores al cliente.
// Además, ahora REGISTRA cada error con Winston 


export const errorHandler = (err, req, res, next) => {
  // Si el error es un AppError, ya tiene toda la info
  if (err instanceof AppError && err.isOperational) {
      const logLevel = err.statusCode >= 500 ? 'error' : 'warning';
    logger[logLevel](
      `[${err.code}] ${err.message} - ${req.method} ${req.originalUrl}`
    );

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }), // Solo si hay detalles
        ...(config.nodeEnv === 'development' && { stack: err.stack }), // Stack solo en dev
      },
    });
  }

  // Si llega acá, es un error NO controlado (bug inesperado).
  // Lo registramos como ERROR con el stack completo para poder investigarlo.
  logger.error(
    `Error no controlado - ${req.method} ${req.originalUrl}\n${err.stack || err.message}`
  );

  // En producción, no exponemos detalles del bug (recordatorio para mi)
  const message =
    config.nodeEnv === 'development'
      ? err.message || 'Error interno del servidor'
      : 'Error interno del servidor';

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};