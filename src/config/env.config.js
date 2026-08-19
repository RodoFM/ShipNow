import dotenv from 'dotenv';

dotenv.config();

// Variables requeridas
const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

// Validar que existan
for (const varName of REQUIRED_ENV_VARS) {
  if (!process.env[varName]) {
    throw new Error(`ariable de entorno requerida no encontrada: ${varName}`);
  }
}



export const config = Object.freeze({
  port: parseInt(process.env.PORT, 10),          
  mongodbUri: process.env.MONGODB_URI,           
  nodeEnv: process.env.NODE_ENV,                 
});