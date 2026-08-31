// Responsabilidad: acceder a la BD para registrar metadatos de archivos en las entidades User, Order y Delivery.
// NO maneja lógica de negocio ni validaciones.

import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Delivery from '../models/delivery.model.js';

export class UploadRepository {
  // ── Agregar metadatos de documento a un usuario ──
  async addDocumentToUser(userId, documentMetadata) {
    return User.findByIdAndUpdate(
      userId,
      { $push: { documents: documentMetadata } },
      { returnDocument: 'after', new: true }
    );
  }

  // ── Agregar metadatos de comprobante a un pedido ──
  async addReceiptToOrder(orderId, receiptMetadata) {
    return Order.findByIdAndUpdate(
      orderId,
      { $push: { receipts: receiptMetadata } },
      { returnDocument: 'after', new: true }
    );
  }

  // ── Agregar metadatos de comprobante a una entrega ──
  async addReceiptToDelivery(deliveryId, receiptMetadata) {
    return Delivery.findByIdAndUpdate(
      deliveryId,
      { $push: { receipts: receiptMetadata } },
      { returnDocument: 'after', new: true }
    );
  }
}