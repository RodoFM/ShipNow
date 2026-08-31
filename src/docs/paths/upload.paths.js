// Define los tres endpoints de subida de archivos como multipart/form-data para que Swagger UI los renderice correctamente.

// ── Parámetro de path ":id" reutilizable ──
const idParam = (description) => ({
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description,
});

// Respuesta 201 genérica para uploads
const upload201Response = (entityName) => ({
  description: `Archivo subido y metadata guardada en ${entityName}`,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: `Documento ${entityName} con el array de archivos actualizado`,
          },
        },
      },
    },
  },
});

// Respuesta de error de archivo (400 / 413 / 422)
const fileErrorSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'INVALID_FILE_TYPE' },
        message: { type: 'string', example: 'Tipo de archivo no permitido. Se aceptan: image/jpeg, image/png, application/pdf' },
      },
    },
  },
};

export const uploadPaths = {

  //POST /api/uploads/users/:id/documents 
  '/api/uploads/users/{id}/documents': {
    post: {
      tags: ['Uploads'],
      summary: 'Subir documento de usuario',
      description:
        'Sube un documento personal del usuario (DNI, licencia o contrato). ' +
        'Solo guarda la metadata en la base de datos; el archivo queda en el servidor ' +
        'bajo `uploads/documents/`. Tipos MIME permitidos: JPEG, PNG y PDF. Tamaño máximo: 5 MB.',
      parameters: [idParam('ObjectId del usuario al que pertenece el documento')],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['document', 'documentType'],
              properties: {
                document: {
                  type: 'string',
                  format: 'binary',
                  description: 'Archivo a subir (JPEG, PNG o PDF, máx. 5 MB)',
                },
                documentType: {
                  type: 'string',
                  enum: ['dni', 'licencia', 'contrato'],
                  description: 'Tipo de documento del usuario',
                },
              },
            },
          },
        },
      },
      responses: {
        201: upload201Response('usuario'),
        400: {
          description: 'Archivo no enviado o tipo de documento inválido',
          content: {
            'application/json': {
              schema: fileErrorSchema,
              examples: {
                sinArchivo: {
                  summary: 'No se adjuntó archivo',
                  value: { success: false, error: { code: 'FILE_REQUIRED', message: 'Se requiere un archivo adjunto.' } },
                },
                tipoInvalido: {
                  summary: 'documentType no permitido',
                  value: { success: false, error: { code: 'INVALID_DOCUMENT_TYPE', message: "Tipo de documento inválido: 'pasaporte'. Valores aceptados: dni, licencia, contrato" } },
                },
                mimeInvalido: {
                  summary: 'Tipo MIME no permitido',
                  value: { success: false, error: { code: 'INVALID_FILE_TYPE', message: 'Tipo de archivo no permitido. Se aceptan: image/jpeg, image/png, application/pdf' } },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        413: {
          description: 'Archivo demasiado grande (supera 5 MB)',
          content: {
            'application/json': {
              schema: fileErrorSchema,
              example: { success: false, error: { code: 'FILE_TOO_LARGE', message: 'El archivo supera el tamaño máximo permitido de 5 MB.' } },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },

  // POST /api/uploads/orders/:id/receipts 
  '/api/uploads/orders/{id}/receipts': {
    post: {
      tags: ['Uploads'],
      summary: 'Subir comprobante de pedido',
      description:
        'Adjunta un comprobante (foto, firma o documento) a un pedido existente. ' +
        'Solo guarda la metadata en la base de datos; el archivo queda en el servidor ' +
        'bajo `uploads/receipts/`. Tipos MIME permitidos: JPEG, PNG y PDF. Tamaño máximo: 5 MB.',
      parameters: [idParam('ObjectId del pedido al que pertenece el comprobante')],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['receipt', 'documentType'],
              properties: {
                receipt: {
                  type: 'string',
                  format: 'binary',
                  description: 'Archivo a subir (JPEG, PNG o PDF, máx. 5 MB)',
                },
                documentType: {
                  type: 'string',
                  enum: ['comprobante', 'foto', 'firma'],
                  description: 'Tipo de comprobante del pedido',
                },
              },
            },
          },
        },
      },
      responses: {
        201: upload201Response('pedido'),
        400: {
          description: 'Archivo no enviado o tipo de comprobante inválido',
          content: {
            'application/json': {
              schema: fileErrorSchema,
              examples: {
                sinArchivo: {
                  summary: 'No se adjuntó archivo',
                  value: { success: false, error: { code: 'FILE_REQUIRED', message: 'Se requiere un archivo adjunto.' } },
                },
                tipoInvalido: {
                  summary: 'documentType no permitido',
                  value: { success: false, error: { code: 'INVALID_DOCUMENT_TYPE', message: "Tipo de documento inválido: 'otro'. Valores aceptados: comprobante, foto, firma" } },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        413: {
          description: 'Archivo demasiado grande (supera 5 MB)',
          content: {
            'application/json': {
              schema: fileErrorSchema,
              example: { success: false, error: { code: 'FILE_TOO_LARGE', message: 'El archivo supera el tamaño máximo permitido de 5 MB.' } },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },

  // POST /api/uploads/deliveries/:id/receipts 
  '/api/uploads/deliveries/{id}/receipts': {
    post: {
      tags: ['Uploads'],
      summary: 'Subir comprobante de entrega',
      description:
        'Adjunta un comprobante (foto de entrega, firma del destinatario, etc.) a una entrega existente. ' +
        'Solo guarda la metadata en la base de datos; el archivo queda en el servidor ' +
        'bajo `uploads/receipts/`. Tipos MIME permitidos: JPEG, PNG y PDF. Tamaño máximo: 5 MB.',
      parameters: [idParam('ObjectId de la entrega a la que pertenece el comprobante')],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['receipt', 'documentType'],
              properties: {
                receipt: {
                  type: 'string',
                  format: 'binary',
                  description: 'Archivo a subir (JPEG, PNG o PDF, máx. 5 MB)',
                },
                documentType: {
                  type: 'string',
                  enum: ['comprobante', 'foto', 'firma'],
                  description: 'Tipo de comprobante de la entrega',
                },
              },
            },
          },
        },
      },
      responses: {
        201: upload201Response('entrega'),
        400: {
          description: 'Archivo no enviado o tipo de comprobante inválido',
          content: {
            'application/json': { schema: fileErrorSchema },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        413: {
          description: 'Archivo demasiado grande (supera 5 MB)',
          content: {
            'application/json': {
              schema: fileErrorSchema,
              example: { success: false, error: { code: 'FILE_TOO_LARGE', message: 'El archivo supera el tamaño máximo permitido de 5 MB.' } },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};