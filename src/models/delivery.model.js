import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../constants/index.js';

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',  //Referencia al pedido que se está entregando
      required: [true, 'La entrega debe estar asociada a un pedido'],
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  //Referencia al repartidor (User con role: 'courier')
      required: false,  //Puede estar sin asignar al principio
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.ASSIGNED,
    },
    assignedAt: {
      type: Date,
      default: Date.now,  //Se llena cuando se crea la entrega
    },
    deliveredAt: {
      type: Date,
      required: false,  //Se llena cuando se marca como entregada
    },
    deliveryAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Argentina' },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden superar los 500 caracteres'],
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;