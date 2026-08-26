// Documentación del módulo PRODUCTS 
export const productsPaths = {
  '/api/products': {
    get: {
      tags: ['Products'],
      summary: 'Listar productos',
      description:
        'Devuelve todos los productos. Con `?onlyAvailable=true` solo devuelve los que tienen stock y status available.',
      parameters: [
        {
          name: 'onlyAvailable',
          in: 'query',
          required: false,
          schema: { type: 'boolean' },
          description: 'Si es true, filtra productos con stock > 0 y status available.',
        },
      ],
      responses: {
        200: {
          description: 'Lista de productos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' },
              },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    post: {
      tags: ['Products'],
      summary: 'Crear un producto',
      description:
        'Crea un producto nuevo. Si el stock es 0, se marca automáticamente como out_of_stock.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProductInput' },
          },
        },
      },
      responses: {
        201: {
          description: 'Producto creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },

  '/api/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Obtener un producto por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del producto',
        },
      ],
      responses: {
        200: {
          description: 'Producto encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    put: {
      tags: ['Products'],
      summary: 'Actualizar un producto',
      description:
        'Actualiza un producto. Mantiene el status coherente con el stock (available / out_of_stock).',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del producto',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProductInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Producto actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Eliminar un producto',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del producto',
        },
      ],
      responses: {
        204: { description: 'Producto eliminado (sin contenido)' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};