// Clase base para TODOS los errores personalizados del dominio.
// Extiende la clase Error nativa de JavaScript y le agrega información
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message); // Llama al constructor de Error con el mensaje

    this.name = this.constructor.name; // Ej: "NotFoundError"
    this.statusCode = statusCode;      // Código HTTP: 404, 400, 409, etc.
    this.code = code;                  // Código interno: "USER_NOT_FOUND"
    this.details = details;            // Info extra opcional (ej: qué campo falló)
    this.isOperational = true;         // Marca: es un error "esperado" del dominio

    // Guarda el stack trace correctamente (para debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}