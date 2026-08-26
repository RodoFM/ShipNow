// Documentación del módulo USERS 
export const usersPaths = {
  '/api/users': {
    get: {
      tags: ['Users'],
      summary: 'Listar usuarios',
      description:
        'Devuelve todos los usuarios. Con `?onlyActive=true` solo devuelve los activos.',
      parameters: [
        {
          name: 'onlyActive',
          in: 'query',
          required: false,
          schema: { type: 'boolean' },
          description: 'Si es true, filtra solo usuarios con active=true.',
        },
      ],
      responses: {
        200: {
          description: 'Lista de usuarios',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    post: {
      tags: ['Users'],
      summary: 'Crear un usuario',
      description:
        'Crea un usuario nuevo. Valida que el email no esté registrado previamente.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UserInput' },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuario creado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        409: { $ref: '#/components/responses/Conflict' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },

  '/api/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Obtener un usuario por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del usuario',
        },
      ],
      responses: {
        200: {
          description: 'Usuario encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    put: {
      tags: ['Users'],
      summary: 'Actualizar un usuario',
      description:
        'Actualiza los datos de un usuario. No permite cambiar la contraseña por esta vía. Valida email duplicado.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del usuario',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UserInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Usuario actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    delete: {
      tags: ['Users'],
      summary: 'Eliminar un usuario',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ObjectId del usuario',
        },
      ],
      responses: {
        204: { description: 'Usuario eliminado (sin contenido)' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};