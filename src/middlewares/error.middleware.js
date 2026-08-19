import { AppError } from '../errors/index.js';
import { config } from '../config/index.js';


// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// Este deberia ser el ÚNICO lugar donde se responden errores al cliente.


export const errorHandler = (err, req, res, next) => {
  // Si el error es un AppError, ya tiene toda la info
  if (err instanceof AppError && err.isOperational) {
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

  // Si llega acá, es un error NO controlado (bug inesperado)
  console.error('ERROR NO CONTROLADO:', err);

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