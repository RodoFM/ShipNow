import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARS = ['PORT', 'MONGO_URI', 'NODE_ENV'];

for (const varName of REQUIRED_ENV_VARS) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}


export const config = Object.freeze({
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
});