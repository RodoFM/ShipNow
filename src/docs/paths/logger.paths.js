// Documentación del módulo LOGGER 
export const loggerPaths = {
  '/api/logger-test': {
    get: {
      tags: ['Logger'],
      summary: 'Probar todos los niveles de log',
      description:
        '⚠️ Herramienta interna de validación, NO es una funcionalidad de negocio. ' +
        'Dispara un log en cada nivel (debug, http, info, warning, error, fatal) para verificar ' +
        'que el sistema de logging (Winston) funciona y que los archivos se escriben correctamente. ' +
        'Solo error y fatal quedan en error-<fecha>.log; todos quedan en combined-<fecha>.log.',
      responses: {
        200: {
          description: 'Logs generados en todos los niveles',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example:
                      'Se generaron logs en todos los niveles. Revisá la consola y la carpeta /logs.',
                  },
                  niveles: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
                  },
                  nota: {
                    type: 'string',
                    example:
                      'Solo error y fatal se persisten en error-<fecha>.log; todos quedan en combined-<fecha>.log.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};