import { AppError } from './AppError.js';


// ---ERRORES GENÉRICOS POR CATEGORÍA HTTP---

// 404 - Recurso no encontrado
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado', code = 'NOT_FOUND', details = null) {
    super(message, 404, code, details);
  }
}

// 400 - Datos de entrada inválidos
export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos', code = 'VALIDATION_ERROR', details = null) {
    super(message, 400, code, details);
  }
}

// 409 - Conflicto (ej: email duplicado)
export class ConflictError extends AppError {
  constructor(message = 'Conflicto de datos', code = 'CONFLICT', details = null) {
    super(message, 409, code, details);
  }
}

// 500 - Error interno del servidor
export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor', code = 'INTERNAL_ERROR', details = null) {
    super(message, 500, code, details);
  }
}


// ---ERRORES ESPECÍFICOS DEL DOMINIO - USUARIOS---


export class UserNotFoundError extends NotFoundError {
  constructor(userId = null) {
    super(
      'Usuario no encontrado',
      'USER_NOT_FOUND',
      userId ? { userId } : null
    );
  }
}

export class DuplicateEmailError extends ConflictError {
  constructor(email = null) {
    super(
      'El email ya está registrado',
      'DUPLICATE_EMAIL',
      email ? { email } : null
    );
  }
}


// ---ERRORES ESPECÍFICOS DEL DOMINIO - PRODUCTOS---


export class ProductNotFoundError extends NotFoundError {
  constructor(productId = null) {
    super(
      'Producto no encontrado',
      'PRODUCT_NOT_FOUND',
      productId ? { productId } : null
    );
  }
}


// ---ERRORES ESPECÍFICOS DEL DOMINIO - PEDIDOS Y ENTREGAS---

export class OrderNotFoundError extends NotFoundError {
  constructor(orderId = null) {
    super(
      'Pedido no encontrado',
      'ORDER_NOT_FOUND',
      orderId ? { orderId } : null
    );
  }
}

export class DeliveryNotFoundError extends NotFoundError {
  constructor(deliveryId = null) {
    super(
      'Entrega no encontrada',
      'DELIVERY_NOT_FOUND',
      deliveryId ? { deliveryId } : null
    );
  }
}

export class InvalidOrderStatusError extends ValidationError {
  constructor(status) {
    super(
      `Estado de pedido inválido: ${status}`,
      'INVALID_ORDER_STATUS',
      { invalidStatus: status }
    );
  }
}


// ---ERRORES ESPECÍFICOS DEL DOMULO DE MOCKING---

export class InvalidMockQuantityError extends ValidationError {
  constructor(qty) {
    super(
      `La cantidad de datos de prueba debe ser un número positivo entre 1 y 100. Recibido: ${qty}`,
      'INVALID_MOCK_QUANTITY',
      { receivedQuantity: qty, allowedRange: '1-100' }
    );
  }
}

export class NegativeValueError extends ValidationError {
  constructor(field) {
    super(
      `El campo "${field}" no puede ser negativo`,
      'NEGATIVE_VALUE',
      { field }
    );
  }
}

export class DatabaseInsertionError extends InternalServerError {
  constructor(collection, originalError = null) {
    super(
      `Error al insertar datos de prueba en la colección "${collection}"`,
      'DATABASE_INSERTION_ERROR',
      { collection, originalError: originalError?.message }
    );
  }
}


// RE-EXPORTAR AppError para facilitar importaciones


export { AppError };