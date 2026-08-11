import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

// Molde de un producto
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true, // Elimina espacios al principio y al final
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS), 
      default: PRODUCT_STATUS.AVAILABLE,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Creamos el modelo a partir del schema
const Product = mongoose.model('Product', productSchema);

export default Product;