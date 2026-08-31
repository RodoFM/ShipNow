// CONFIGURACIÓN DE SWAGGER / OpenAPI 
// Toda la definición de la documentación vive acá, SEPARADA de la lógica de rutas. index.js solo llama a setupSwagger(app).

import swaggerUi from 'swagger-ui-express';
import { config } from '../config/index.js';
import { schemas, responses } from './components.js';
import { usersPaths } from './paths/users.paths.js';
import { productsPaths } from './paths/products.paths.js';
import { mocksPaths } from './paths/mocks.paths.js';
import { loggerPaths } from './paths/logger.paths.js';
import { uploadPaths } from './paths/upload.paths.js';

//Documento OpenAPI 3.0 
const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'ShipNow API',
    version: '1.0.0',
    description:
      'API de logística de ShipNow. Permite gestionar usuarios y productos, generar ' +
      'datos de prueba (mocks) y validar el sistema de logging. Construida con Node.js, ' +
      'Express y MongoDB siguiendo una arquitectura por capas (Controller → Service → Repository), ' +
      'con manejo centralizado de errores y logging profesional con Winston.',
    contact: { name: 'Rodolfo Fernández' },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Servidor local de desarrollo',
    },
  ],
  // Tags: agrupan los endpoints por módulo
  tags: [
    { name: 'Users', description: 'Gestión de usuarios (CRUD completo)' },
    { name: 'Products', description: 'Gestión de productos (CRUD completo)' },
    {
      name: 'Mocks',
      description:
        'Generación e inserción de datos de prueba (usuarios, pedidos y entregas) con Faker.',
    },
    {
      name: 'Logger',
      description:
        'Herramienta interna para validar el sistema de logging. No es funcionalidad de negocio.',
    },
  ],
  // Todas las rutas, unidas desde los archivos por módulo
  paths: {
    ...usersPaths,
    ...productsPaths,
    ...mocksPaths,
    ...loggerPaths,
    ...uploadPaths,
  },
  // Componentes reutilizables: schemas y respuestas de error
  components: {
    schemas,
    responses,
  },
};

// Monta Swagger UI en la ruta indicada (por defecto /api/docs)
export const setupSwagger = (app, path = '/api/docs') => {
  app.use(path, swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'ShipNow API - Documentación',
    swaggerOptions: { docExpansion: 'none' }, // arranca con los tags colapsados
  }));

  // Endpoint extra: expone el JSON crudo del spec (puede servir para importar en Postman/Insomnia)
  app.get('/api/docs.json', (req, res) => res.json(openapiSpec));
};

export default setupSwagger;