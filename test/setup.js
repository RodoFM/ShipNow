import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';

export const mochaHooks = {
  async beforeAll() {
    await connectDB();
  },

  async afterAll() {
    await mongoose.disconnect();
  },

  async beforeEach() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  },
};
