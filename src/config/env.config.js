// CONFIGURACIÓN Y VALIDACIÓN DE VARIABLES DE ENTORNO
// Este archivo centraliza la carga y validación de todas lasvariables de entorno críticas para que la aplicación funcione.
// IMPORTANTE: Si NODE_ENV=test, carga .env.test (entorno de testing separado).

import dotenv from 'dotenv';

// ── Detectar el archivo .env correcto según el entorno ──
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// ── Variables CRÍTICAS (la app no arranca sin ellas) ──
const requiredVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(
      `Variable de entorno "${varName}" no definida. Revisá tu archivo ${envFile}`
    );
  }
});

// ── Exportar configuración validada ──
export const config = Object.freeze({
  port: parseInt(process.env.PORT, 10),
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
});