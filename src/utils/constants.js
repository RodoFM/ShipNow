//Roles de usario
//    - "cliente"    equivale a  USER_ROLES.USER
//    - "repartidor" equivale a  USER_ROLES.COURIER

export const USER_ROLES = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    COURIER: 'courier',
});  

// Estados posibles de un producto
export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'available',           // Disponible para comprar
  OUT_OF_STOCK: 'out_of_stock',     // Sin stock
  DISCONTINUED: 'discontinued',      // Descontinuado
});

// Estados de un pedido y/o envío
export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',         // Pendiente de procesar
  PROCESSING: 'processing',   // En preparación
  SHIPPED: 'shipped',         // Enviado
  DELIVERED: 'delivered',     // Entregado
  CANCELLED: 'cancelled',     // Cancelado
});

// Prioridades posibles de un pedido
export const ORDER_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

// Estados posibles de una entrega 
export const DELIVERY_STATUS = Object.freeze({
  ASSIGNED: 'assigned',       // Asignada a un repartidor
  IN_TRANSIT: 'in_transit',   // En camino
  DELIVERED: 'delivered',     // Entregada
  FAILED: 'failed',           // Falló la entrega
});

// Tipos de documento permitidos para usuarios
export const USER_DOCUMENT_TYPES = Object.freeze({
  DNI: 'dni',
  LICENCIA: 'licencia',
  CONTRATO: 'contrato',
});

// Tipos de comprobante permitidos para pedidos y entregas
export const RECEIPT_TYPES = Object.freeze({
  COMPROBANTE: 'comprobante',
  FOTO: 'foto',
  FIRMA: 'firma',
});

// Tipos MIME permitidos para uploads
export const ALLOWED_MIME_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'application/pdf',
]);

// Tamaño máximo de archivo (5 MB en bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;