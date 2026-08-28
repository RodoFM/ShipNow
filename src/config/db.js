// CONEXIÓN A MONGODB
// Este archivo encapsula toda la lógica de conexión a la base de datos.
// En modo test, lanza el error para que los tests lo manejen.
import mongoose from 'mongoose';
import { config } from './index.js';
import logger from './logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.fatal(`MongoDB connection error: ${error.message}`);

    // En modo test, lanzamos el error para que los tests lo capturen
    if (config.nodeEnv === 'test') {
      throw error;
    }

    // En otros entornos, terminamos el proceso
    process.exit(1);
  }
};

export default connectDB;