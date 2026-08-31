// Registra los endpoints de carga de archivos e inyecta el middleware de Multer ANTES del controlador.
// La configuración de Multer vive en src/config/multer.config.js.

import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { uploadDocument, uploadReceipt, handleMulterError,} from '../config/multer.config.js';

const router = Router();
const uploadController = new UploadController();

// POST /api/uploads/users/:id/documents
// Recibe: campo "document" (archivo) + campo "documentType" (texto)
router.post(
  '/users/:id/documents',
  handleMulterError(uploadDocument),           // 1° Multer: guarda el archivo en disco
  (req, res, next) => uploadController.uploadUserDocument(req, res, next) // 2° Controlador
);

// POST /api/uploads/orders/:id/receipts
// Recibe: campo "receipt" (archivo) + campo "documentType" (texto)
router.post(
  '/orders/:id/receipts',
  handleMulterError(uploadReceipt),
  (req, res, next) => uploadController.uploadOrderReceipt(req, res, next)
);

// POST /api/uploads/deliveries/:id/receipts
// Recibe: campo "receipt" (archivo) + campo "documentType" (texto)
router.post(
  '/deliveries/:id/receipts',
  handleMulterError(uploadReceipt),
  (req, res, next) => uploadController.uploadDeliveryReceipt(req, res, next)
);

export default router;