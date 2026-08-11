import mongoose from 'mongoose';

import {config} from './index.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('Error connecting to MongoDB:', error.message );
    process.exit(1);
  }
}

export default connectDB;