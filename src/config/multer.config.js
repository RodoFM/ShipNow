import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../constants/index.js';
import { InvalidFileTypeError, FileSizeLimitError } from '../errors/index.js';

// ── Storage de documentos de usuario ── carpeta: uploads/documents/
const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/documents');
  },
  filename: (_req, file, cb) => {
    // Nombre: timestamp-uuid.extension → evita colisiones y nombres con espacios
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// ── Storage de comprobantes de pedidos y entregas ── carpeta: uploads/receipts/
const receiptStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/receipts');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// ── Filtro de tipos MIME (compartido por ambas configuraciones) ──
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);                                                 // aceptar
  } else {
    cb(new InvalidFileTypeError(file.mimetype, [...ALLOWED_MIME_TYPES]));  // rechazar
  }
};

// ── Instancia para documentos de usuario ──
export const uploadDocument = multer({
  storage: documentStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('document');   // el campo del form-data debe llamarse "document"

// ── Instancia para comprobantes ──
export const uploadReceipt = multer({
  storage: receiptStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('receipt');    // el campo del form-data debe llamarse "receipt"

// ── Wrapper para convertir errores de Multer a AppError ──
export const handleMulterError = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (!err) return next();

    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new FileSizeLimitError(MAX_FILE_SIZE));
    }
    if (err.name === 'AppError') {
      return next(err);
    }
    return next(err);
  });
};