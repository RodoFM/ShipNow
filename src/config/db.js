import mongoose from 'mongoose';

import {config} from './index.js';
import logger from './logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.fatal(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;