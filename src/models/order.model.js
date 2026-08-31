import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';

// Sub-esquema para los items (productos) del pedido
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Referencia al modelo Product
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo'],
  },
});

// Esquema principal del pedido
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Referencia al usuario que hizo el pedido
      required: [true, 'El pedido debe estar asociado a un usuario'],
    },
    items: {
      type: [orderItemSchema],  // Array de productos con cantidad y precio
      validate: {
        validator: (items) => items && items.length > 0,
        message: 'El pedido debe tener al menos un producto',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'El total del pedido es obligatorio'],
      min: [0, 'El total no puede ser negativo'],
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(ORDER_PRIORITY),
      default: ORDER_PRIORITY.MEDIUM,
    },
    orderDate: {
      type: Date,
      default: Date.now,  // Se guarda automáticamente la fecha actual
    },
    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Argentina' },
    },
    receipts: [
      {
        originalName:   { type: String, required: true },
        generatedName:  { type: String, required: true },
        path:           { type: String, required: true },
        mimetype:       { type: String, required: true },
        size:           { type: Number, required: true },
        documentType:   { type: String, required: true },
        uploadedAt:     { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,  // Agrega createdAt y updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;