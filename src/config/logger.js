// LOGGER CENTRALIZADO - Winston
// Un único punto de configuración del sistema de logs de ShipNow.
// Se importa desde cualquier archivo con: import logger from '../config/logger.js';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// ── Carpeta donde se guardan los archivos de logs ──
const LOGS_DIR = path.resolve('logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ── Niveles personalizados (de mayor a menor gravedad) ──
// El número indica prioridad: 0 = más grave. Winston registra los niveles
// cuyo número sea <= al nivel configurado.
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red bold',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

// Registramos los colores en Winston (para la salida por consola)
winston.addColors(customLevels.colors);

// ── Formato de las fechas: 2026-08-01 10:12:03 ──
const timestampFormat = timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

// ── Formato del mensaje: nivel + timestamp + mensaje ──
// Ejemplo: 2026-08-01 10:12:03 [info]    Servidor escuchando en el puerto 3000
const lineFormat = printf(({ level, message, timestamp, stack }) => {
  // padEnd alinea el nivel para que quede prolijo en columnas
  const levelLabel = `[${level}]`.padEnd(10);
  // Si el error trae stack, lo mostramos después del mensaje
  return `${timestamp} ${levelLabel} ${stack || message}`;
});

// ── Nivel según el entorno ──
// En desarrollo mostramos TODO (hasta debug).
// En producción solo desde info hacia arriba (info, warning, error, fatal).
const level = config.nodeEnv === 'development' ? 'debug' : 'info';

// ── Transportes (destinos de salida) ──
const transports = [
  // 1) CONSOLA: con colores, legible para el desarrollador, al destacar llama la atención.
  //    colorize va AL FINAL para no romper la alineación (padEnd) del nivel.
  new winston.transports.Console({
    format: combine(
      timestampFormat,
      errors({ stack: true }),
      lineFormat,
      colorize({ all: true })
    ),
  }),

  // 2) ARCHIVO ROTADO DE ERRORES: solo error y fatal.
  //    Rota por día y conserva 14 días como máximo.
  new DailyRotateFile({
    dirname: LOGS_DIR,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error', // 'error' y 'fatal' (fatal es más grave, también entra)
    maxFiles: '14d', // conserva 14 días
    maxSize: '10m', // rota si un archivo supera 10 MB
    format: combine(timestampFormat, errors({ stack: true }), lineFormat),
  }),

  // 3) ARCHIVO ROTADO COMBINADO: todos los niveles (historial completo).
  new DailyRotateFile({
    dirname: LOGS_DIR,
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '10m',
    format: combine(timestampFormat, errors({ stack: true }), lineFormat),
  }),
];

// ── Creamos el logger con nuestros niveles personalizados ──
const logger = winston.createLogger({
  levels: customLevels.levels,
  level,
  transports,
  exitOnError: false,
});

export default logger;