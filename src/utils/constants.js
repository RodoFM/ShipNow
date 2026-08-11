//Roles de usario
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