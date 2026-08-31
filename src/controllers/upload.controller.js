// Responsabilidad: recibir la request, delegar en el servicio,
// responder y registrar eventos en el logger.
// NO contiene lógica de negocio ni de validación.

import { UploadService } from '../services/upload.service.js';
import logger from '../config/logger.js';

const uploadService = new UploadService();

export class UploadController {

  // POST /api/uploads/users/:id/documents
  async uploadUserDocument(req, res, next) {
    try {
      const { id } = req.params;
      const { documentType } = req.body;
      const file = req.file; // lo inyecta Multer si el upload fue exitoso

      const updatedUser = await uploadService.uploadUserDocument(id, file, documentType);

      logger.info(
        `Documento subido para usuario ${id}: ${file?.filename} (tipo: ${documentType})`
      );

      res.status(201).json({
        success: true,
        message: 'Documento cargado y asociado al usuario correctamente',
        document: updatedUser.documents.at(-1), // el último documento agregado
        userId: updatedUser._id,
      });
    } catch (error) {
      logger.warning(
        `Error al subir documento para usuario ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  }

  // POST /api/uploads/orders/:id/receipts
  async uploadOrderReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const { documentType } = req.body;
      const file = req.file;

      const updatedOrder = await uploadService.uploadOrderReceipt(id, file, documentType);

      logger.info(
        `Comprobante subido para pedido ${id}: ${file?.filename} (tipo: ${documentType})`
      );

      res.status(201).json({
        success: true,
        message: 'Comprobante cargado y asociado al pedido correctamente',
        receipt: updatedOrder.receipts.at(-1),
        orderId: updatedOrder._id,
      });
    } catch (error) {
      logger.warning(
        `Error al subir comprobante para pedido ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  }

  // POST /api/uploads/deliveries/:id/receipts
  async uploadDeliveryReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const { documentType } = req.body;
      const file = req.file;

      const updatedDelivery = await uploadService.uploadDeliveryReceipt(id, file, documentType);

      logger.info(
        `Comprobante subido para entrega ${id}: ${file?.filename} (tipo: ${documentType})`
      );

      res.status(201).json({
        success: true,
        message: 'Comprobante cargado y asociado a la entrega correctamente',
        receipt: updatedDelivery.receipts.at(-1),
        deliveryId: updatedDelivery._id,
      });
    } catch (error) {
      logger.warning(
        `Error al subir comprobante para entrega ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  }
}