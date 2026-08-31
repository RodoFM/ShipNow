// Responsabilidad: lógica de negocio de uploads.
//   - Valida que la entidad exista
//   - Valida el tipo de documento
//   - Construye los metadatos del archivo
//   - Delega el guardado en BD al repositorio

import { UploadRepository } from '../repositories/upload.repository.js';
import { UserNotFoundError, OrderNotFoundError, DeliveryNotFoundError, FileRequiredError, InvalidDocumentTypeError,} from '../errors/index.js';
import { USER_DOCUMENT_TYPES, RECEIPT_TYPES, } from '../constants/index.js';

const uploadRepository = new UploadRepository();

export class UploadService {

  // Subir documento de usuario 
  async uploadUserDocument(userId, file, documentType) {
    // 1️ Validar que se envió el archivo
    if (!file) throw new FileRequiredError('document');

    // 2️ Validar tipo de documento
    const allowedTypes = Object.values(USER_DOCUMENT_TYPES);
    if (!allowedTypes.includes(documentType)) {
      throw new InvalidDocumentTypeError(documentType, allowedTypes);
    }

    // 3️ Construir metadatos
    const metadata = {
      originalName:  file.originalname,
      generatedName: file.filename,
      path:          file.path.replace(/\\/g, '/'), // normalizar Windows
      mimetype:      file.mimetype,
      size:          file.size,
      documentType,
      uploadedAt:    new Date(),
    };

    // 4️ Guardar en BD y verificar que el usuario existe
    const updatedUser = await uploadRepository.addDocumentToUser(userId, metadata);
    if (!updatedUser) throw new UserNotFoundError(userId);

    return updatedUser;
  }

  // Subir comprobante de pedido 
  async uploadOrderReceipt(orderId, file, documentType) {
    if (!file) throw new FileRequiredError('receipt');

    const allowedTypes = Object.values(RECEIPT_TYPES);
    if (!allowedTypes.includes(documentType)) {
      throw new InvalidDocumentTypeError(documentType, allowedTypes);
    }

    const metadata = {
      originalName:  file.originalname,
      generatedName: file.filename,
      path:          file.path.replace(/\\/g, '/'),
      mimetype:      file.mimetype,
      size:          file.size,
      documentType,
      uploadedAt:    new Date(),
    };

    const updatedOrder = await uploadRepository.addReceiptToOrder(orderId, metadata);
    if (!updatedOrder) throw new OrderNotFoundError(orderId);

    return updatedOrder;
  }

  // Subir comprobante de entrega 
  async uploadDeliveryReceipt(deliveryId, file, documentType) {
    if (!file) throw new FileRequiredError('receipt');

    const allowedTypes = Object.values(RECEIPT_TYPES);
    if (!allowedTypes.includes(documentType)) {
      throw new InvalidDocumentTypeError(documentType, allowedTypes);
    }

    const metadata = {
      originalName:  file.originalname,
      generatedName: file.filename,
      path:          file.path.replace(/\\/g, '/'),
      mimetype:      file.mimetype,
      size:          file.size,
      documentType,
      uploadedAt:    new Date(),
    };

    const updatedDelivery = await uploadRepository.addReceiptToDelivery(deliveryId, metadata);
    if (!updatedDelivery) throw new DeliveryNotFoundError(deliveryId);

    return updatedDelivery;
  }
}