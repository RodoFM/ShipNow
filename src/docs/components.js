// CSchemas y respuestas reutilizables
// Se definen una sola vez y se referencian desde los endpoints con $ref.
// Reflejan EXACTAMENTE los modelos reales de Mongoose y las respuestas que devuelve la API (no se documenta nada que la API no haga).


export const schemas = {
  // Entidad Usuario (models/user.model.js) 
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '65b8f0c2e1a2b3c4d5e6f7a8' },
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', format: 'email', example: 'juan@test.com' },
      password: {
        type: 'string',
        description: 'Se almacena tal cual se recibe (mínimo 6 caracteres).',
        example: '123456',
      },
      role: {
        type: 'string',
        enum: ['user', 'admin', 'courier'],
        default: 'user',
        example: 'user',
      },
      active: { type: 'boolean', default: true, example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  // Body para crear/actualizar un usuario
  UserInput: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'Juan Pérez' },
      email: { type: 'string', format: 'email', example: 'juan@test.com' },
      password: {
        type: 'string',
        minLength: 6,
        example: '123456',
      },
      role: {
        type: 'string',
        enum: ['user', 'admin', 'courier'],
        example: 'user',
      },
      active: { type: 'boolean', example: true },
    },
  },

  // Entidad Producto (models/product.model.js)
  Product: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '65b8f0c2e1a2b3c4d5e6f7a9' },
      name: { type: 'string', example: 'Mouse Gamer' },
      description: { type: 'string', example: 'Mouse óptico 7200 DPI' },
      price: { type: 'number', example: 25.99 },
      stock: { type: 'integer', example: 10 },
      status: {
        type: 'string',
        enum: ['available', 'out_of_stock', 'discontinued'],
        default: 'available',
        example: 'available',
      },
      category: { type: 'string', example: 'Periféricos' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  //Body para crear/actualizar un producto
  ProductInput: {
    type: 'object',
    required: ['name', 'price', 'stock'],
    properties: {
      name: { type: 'string', example: 'Mouse Gamer' },
      description: { type: 'string', example: 'Mouse óptico 7200 DPI' },
      price: { type: 'number', minimum: 0, example: 25.99 },
      stock: { type: 'integer', minimum: 0, example: 10 },
      category: { type: 'string', example: 'Periféricos' },
    },
  },

  //Item de un pedido (sub-esquema de Order)
  OrderItem: {
    type: 'object',
    properties: {
      product: {
        type: 'string',
        description: 'ObjectId del producto',
        example: '65b8f0c2e1a2b3c4d5e6f7a9',
      },
      quantity: { type: 'integer', minimum: 1, example: 2 },
      price: { type: 'number', minimum: 0, example: 25.99 },
    },
  },

  // Entidad Pedido (models/order.model.js)
  Order: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '65b8f0c2e1a2b3c4d5e6f7b0' },
      user: {
        type: 'string',
        description: 'ObjectId del usuario que hizo el pedido',
        example: '65b8f0c2e1a2b3c4d5e6f7a8',
      },
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/OrderItem' },
      },
      totalAmount: { type: 'number', example: 151.98 },
      status: {
        type: 'string',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        example: 'pending',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        example: 'medium',
      },
      orderDate: { type: 'string', format: 'date-time' },
      shippingAddress: { $ref: '#/components/schemas/Address' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  // Entidad Entrega (models/delivery.model.js)
  
  Delivery: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '65b8f0c2e1a2b3c4d5e6f7b1' },
      order: {
        type: 'string',
        description: 'ObjectId del pedido asociado',
        example: '65b8f0c2e1a2b3c4d5e6f7b0',
      },
      courier: {
        type: 'string',
        nullable: true,
        description: 'ObjectId del repartidor (User con role courier). Puede ser null si no fue asignado.',
        example: '65b8f0c2e1a2b3c4d5e6f7a8',
      },
      status: {
        type: 'string',
        enum: ['assigned', 'in_transit', 'delivered', 'failed'],
        default: 'assigned',
        example: 'assigned',
      },
      assignedAt: { type: 'string', format: 'date-time' },
      deliveredAt: { type: 'string', format: 'date-time', nullable: true },
      deliveryAddress: { $ref: '#/components/schemas/Address' },
      notes: { type: 'string', example: 'Tocar timbre' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  //Sub-esquema de dirección (usado por Order y Delivery) 
  Address: {
    type: 'object',
    properties: {
      street: { type: 'string', example: 'Av. Siempre Viva 742' },
      city: { type: 'string', example: 'Buenos Aires' },
      postalCode: { type: 'string', example: 'C1000' },
      country: { type: 'string', default: 'Argentina', example: 'Argentina' },
    },
  },

  //Respuesta de ERROR 
  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Código interno del error',
            example: 'USER_NOT_FOUND',
          },
          message: {
            type: 'string',
            example: 'Usuario no encontrado',
          },
          details: {
            type: 'object',
            nullable: true,
            description: 'Información extra opcional (ej: qué campo falló).',
            example: { userId: '65b8f0c2e1a2b3c4d5e6f7a8' },
          },
          stack: {
            type: 'string',
            nullable: true,
            description: 'Solo presente en entorno development.',
          },
        },
      },
    },
  },

  // Respuesta exitosa genérica (ej: seed de mocks)
  SuccessResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Datos de prueba insertados correctamente',
      },
      insertados: {
        type: 'object',
        properties: {
          usuarios: { type: 'integer', example: 13 },
          pedidos: { type: 'integer', example: 15 },
          entregas: { type: 'integer', example: 15 },
        },
      },
    },
  },
};

// Respuestas de error REUTILIZABLES (coinciden con los errores reales) 
export const responses = {
  ValidationError: {
    description: 'Datos inválidos (VALIDATION_ERROR)',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' },
        },
      },
    },
  },
  NotFound: {
    description: 'Recurso no encontrado (USER_NOT_FOUND / PRODUCT_NOT_FOUND / ROUTE_NOT_FOUND)',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
            details: { userId: '65b8f0c2e1a2b3c4d5e6f7a8' },
          },
        },
      },
    },
  },
  Conflict: {
    description: 'Conflicto de datos, ej: email duplicado (DUPLICATE_EMAIL)',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: 'El email ya está registrado',
            details: { email: 'juan@test.com' },
          },
        },
      },
    },
  },
  InvalidMockQuantity: {
    description: 'Cantidad inválida en mocks (INVALID_MOCK_QUANTITY)',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: {
            code: 'INVALID_MOCK_QUANTITY',
            message:
              'La cantidad de datos de prueba debe ser un número positivo entre 1 y 100. Recibido: -5',
            details: { receivedQuantity: '-5', allowedRange: '1-100' },
          },
        },
      },
    },
  },
  InternalError: {
    description: 'Error interno del servidor (INTERNAL_ERROR / DATABASE_INSERTION_ERROR)',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
        },
      },
    },
  },
};