// Documentación del módulo MOCKS 
// El parámetro qty se valida: debe ser entero entre 1 y 100 (si no, INVALID_MOCK_QUANTITY).
const qtyParam = (defaultValue) => ({
  name: 'qty',
  in: 'query',
  required: false,
  schema: { type: 'integer', minimum: 1, maximum: 100, default: defaultValue },
  description: `Cantidad a generar (entre 1 y 100). Por defecto ${defaultValue}.`,
});

export const mocksPaths = {
  '/api/mocks/users': {
    get: {
      tags: ['Mocks'],
      summary: 'Generar usuarios de prueba (sin persistir)',
      description: 'Genera un array de usuarios falsos con Faker. NO los guarda en la base.',
      parameters: [qtyParam(5)],
      responses: {
        200: {
          description: 'Usuarios generados',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidMockQuantity' },
      },
    },
  },

  '/api/mocks/orders': {
    get: {
      tags: ['Mocks'],
      summary: 'Generar pedidos de prueba (sin persistir)',
      description: 'Genera un array de pedidos falsos con Faker. NO los guarda en la base.',
      parameters: [qtyParam(3)],
      responses: {
        200: {
          description: 'Pedidos generados',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Order' },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidMockQuantity' },
      },
    },
  },

  '/api/mocks/deliveries': {
    get: {
      tags: ['Mocks'],
      summary: 'Generar entregas de prueba (sin persistir)',
      description: 'Genera un array de entregas falsas con Faker. NO las guarda en la base.',
      parameters: [qtyParam(3)],
      responses: {
        200: {
          description: 'Entregas generadas',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Delivery' },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidMockQuantity' },
      },
    },
  },

  '/api/mocks/seed': {
    post: {
      tags: ['Mocks'],
      summary: 'Insertar datos de prueba en la base (seed)',
      description:
        'Genera e inserta datos de prueba en MongoDB en orden: usuarios → pedidos → entregas. ' +
        'El parámetro qty controla el volumen base (usuarios). Los pedidos son ~1.5x y se ' +
        'agregan repartidores adicionales (~qty/3).',
      parameters: [qtyParam(10)],
      responses: {
        201: {
          description: 'Datos de prueba insertados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/InvalidMockQuantity' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};