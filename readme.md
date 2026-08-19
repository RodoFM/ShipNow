ShipNow (Api de logistica)

API REST profesional construida con arquitectura de 3 capas (Controller-Service-Repository) para gestión de envíos, productos y usuarios.

Arquitectura:

Este proyecto sigue una arquitectura de capas claramente separadas:
src/
├── config/ # Configuración centralizada y validación de entorno
├── constants/ # Diccionario de constantes del dominio
├── errors/ # Sistema de errores personalizados (Módulo 3)
├── middlewares/ # Middleware global de manejo de errores (Módulo 3)
├── models/ # Esquemas de Mongoose (estructura de datos)
├── repositories/ # Capa de acceso a datos (única que conoce MongoDB)
├── services/ # Lógica de negocio
├── controllers/ # Controladores HTTP (reciben req, devuelven res)
└── routes/ # Definición de endpoints


Flujo de dependencias:

Router → Controller → Service → Repository → MongoDB

- **Controller**: Única puerta de entrada HTTP. Maneja `req` y `res`.
- **Service**: Contiene la lógica de negocio y reglas del dominio.
- **Repository**: Único lugar que conoce Mongoose/MongoDB. Encapsula acceso a datos.

Ventajas: 
**Modularidad**: Cada capa tiene una responsabilidad única y clara
**Testeabilidad**: Puedes testear la lógica de negocio sin levantar un servidor HTTP
**Mantenibilidad**: Cambiar de base de datos solo afecta al Repository
**Escalabilidad**: Fácil agregar nuevas entidades siguiendo el mismo patrón

                            **Instalación y uso**

**Requisistos
- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

Paso1: Clonar Reppositorio

En la terminal (bash):
git clone https://github.com/RodoFM/ShipNow.git
cd ShipNow

Paso2: Clonar
bash:
npm install

Paso 3: Configurar variables de entorno
Copia el archivo .env.example y renombralo a .env:
bash:
cp .env.example .env

Luego edita el .env con tus valores:
env:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shipnow
NODE_ENV=development

**Importante: Si las variables críticas (PORT, MONGODB_URI, NODE_ENV) no están definidas, la aplicación lanzará un error descriptivo y no arrancará.**

Paso 4: Iniciar MongoDB

Paso 5: Iniciar el servidor
bash:
node src/index.js


Deberías ver:
Servidor corriendo en el puerto 3000
MongoDB conectado correctamente
Endpoints Disponibles
Productos
Método	Endpoint	Descripción
GET	/api/products	Listar todos los productos
GET	/api/products?onlyAvailable=true	Listar solo productos disponibles
GET	/api/products/:id	Obtener un producto por ID
POST	/api/products	Crear un producto nuevo
PUT	/api/products/:id	Actualizar un producto
DELETE	/api/products/:id	Eliminar un producto
Usuarios
Método	Endpoint	Descripción
GET	/api/users	Listar todos los usuarios
GET	/api/users?onlyActive=true	Listar solo usuarios activos
GET	/api/users/:id	Obtener un usuario por ID
POST	/api/users	Crear un usuario nuevo
PUT	/api/users/:id	Actualizar un usuario
DELETE	/api/users/:id	Eliminar un usuario


##Mocking (Módulo 2)

Método	Endpoint	Descripción
GET	/api/mocks/users?qty=N	Generar N usuarios sin guardarlos
GET	/api/mocks/orders?qty=N	Generar N pedidos sin guardarlos
GET	/api/mocks/deliveries?qty=N	Generar N entregas sin guardarlas
POST	/api/mocks/seed?qty=N	Insertar datos de prueba en MongoDB con relaciones válidas


            ##Sistema de Manejo de Errores Profesional (modulo3)

##Características Principales

- **Centralizado**: Un único middleware maneja TODOS los errores (no hay respuestas dispersas en controllers)
- **Errores del dominio**: Clases personalizadas para cada caso de negocio (`UserNotFoundError`, `DuplicateEmailError`, etc.)
- **Respuestas uniformes**: Estructura consistente con `success`, `code`, `message` y `details`
- **Seguridad**: Stack trace solo en desarrollo, mensajes genéricos para bugs en producción
- **Validaciones robustas**: El módulo de mocking valida cantidades, valores negativos y fallas de base de datos

##Estructura de Respuesta de Error

Todas las respuestas de error siguen este formato uniforme:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo en español",
    "details": {
      // Información contextual específica del error
    },
    "stack": "..." // Solo en NODE_ENV=development
  }
}

    ##Códigos de Error Disponibles

Código	               HTTP Status	    Descripción	                    Detalles Incluidos
USER_NOT_FOUND	          404	          Usuario no encontrado	                userId
PRODUCT_NOT_FOUND	        404	          Producto no encontrado	              productId
ORDER_NOT_FOUND	          404	          Pedido no encontrado	                orderId
DELIVERY_NOT_FOUND	      404	          Entrega no encontrada	                deliveryId
DUPLICATE_EMAIL	          409	          Email ya registrado	                  email
INVALID_ORDER_STATUS	    400	          Estado de pedido inválido	            invalidStatus, allowedStatuses
INVALID_MOCK_QUANTITY	    400	          Cantidad de mocking fuera de rango	  receivedQuantity, allowedRange
NEGATIVE_VALUE_ERROR	    400	          Valor negativo no permitido	          field, receivedValue
DATABASE_INSERTION_ERROR	500	          Error al insertar en MongoDB	        collection, originalError
INTERNAL_ERROR	          500	          Error genérico no controlado	              -


--Ejemplos de Respuestas de Error--
Usuario no encontrado (404)
bash
curl http://localhost:3000/api/users/673d4f8e9b1a2c3d4e5f6789

Respuesta:
json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuario no encontrado",
    "details": {
      "userId": "673d4f8e9b1a2c3d4e5f6789"
    }
  }
}

Email duplicado (409)
bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"existente@test.com","password":"123456","role":"user"}'

Respuesta:
json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "El email ya está registrado",
    "details": {
      "email": "existente@test.com"
    }
  }
}

Cantidad de mocking inválida (400)
bash
# Cantidad negativa
curl "http://localhost:3000/api/mocks/users?qty=-5"

# Cantidad muy grande
curl "http://localhost:3000/api/mocks/users?qty=200"

# Cantidad no numérica
curl "http://localhost:3000/api/mocks/users?qty=abc"

Respuesta:
json
{
  "success": false,
  "error": {
    "code": "INVALID_MOCK_QUANTITY",
    "message": "La cantidad de datos de prueba debe ser un número positivo entre 1 y 100. Recibido: -5",
    "details": {
      "receivedQuantity": "-5",
      "allowedRange": "1-100"
    }
  }
}

Arquitectura del Sistema de Errores
src/
├── errors/
│   ├── AppError.js              # Clase base para todos los errores personalizados
│   └── index.js                 # Diccionario de errores del dominio
│
├── middlewares/
│   └── error.middleware.js      # Middleware global (ÚNICO lugar que responde errores)
│
├── services/
│   └── *.service.js            # DETECTAN errores y lanzan excepciones personalizadas
│
└── controllers/
    └── *.controller.js         # DERIVAN errores al middleware con next(error)


Flujo:
Service detecta un problema → lanza throw new UserNotFoundError(id)
Controller atrapa el error → llama next(error)
Middleware recibe el error → responde con formato uniforme


--Seguridad: Desarrollo vs Producción--
En desarrollo (NODE_ENV=development):
- Stack trace completo
- Mensajes de error detallados


En producción (NODE_ENV=production):
- Stack trace oculto
- Detalles internos ocultos para bugs no controlados
- Solo mensaje genérico: "Error interno del servidor"
- Validaciones del Módulo de Mocking

El módulo de mocking (/api/mocks/*) valida:
Validación	Código de Error	Descripción
qty < 1	INVALID_MOCK_QUANTITY	Rechaza cantidades negativas o cero
qty > 100	INVALID_MOCK_QUANTITY	Limita a 100 registros por request
qty = 'abc'	INVALID_MOCK_QUANTITY	Rechaza valores no numéricos
Falla en MongoDB	DATABASE_INSERTION_ERROR	Captura errores al insertar usuarios/pedidos/entregas



                        **Ejemplos de Uso**
Crear un producto
bash:
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse Gamer","price":25.99,"stock":10,"category":"Periféricos"}'

Listar productos disponibles
bash
curl http://localhost:3000/api/products?onlyAvailable=true

Crear un usuario
bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@test.com","password":"123456","role":"user"}'

**Mocking y Datos de Prueba
Generar usuarios de prueba (sin guardar)
bash
curl "http://localhost:3000/api/mocks/users?qty=5"

Respuesta esperada:

json
Copy
[
  {
    "name": "Ana Pérez",
    "email": "ana.perez@gmail.com",
    "password": "aB3xY9zQ",
    "role": "user",
    "active": true
  },
  {
    "name": "Luis Gómez",
    "email": "luis.gomez@hotmail.com",
    "password": "kL8mN2pR",
    "role": "courier",
    "active": true
  }
]
Generar pedidos de prueba (sin guardar)
bash
Copy
curl "http://localhost:3000/api/mocks/orders?qty=3"
Insertar datos de prueba en la base de datos (seed)
bash
Copy
curl -X POST "http://localhost:3000/api/mocks/seed?qty=10"
Respuesta esperada:

json
Copy
{
  "message": "Datos de prueba insertados correctamente",
  "insertados": {
    "usuarios": 13,
    "pedidos": 15,
    "entregas": 15
  }
}


¿Qué hace el seed?
-Inserta qty usuarios (clientes) + ~33% repartidores
-Crea ~1.5 pedidos por cliente (asociados a clientes reales)
-Genera 1 entrega por pedido (asignadas a repartidores reales)

Todas las relaciones son válidas:
-Los pedidos apuntan a usuarios que existen
-Las entregas apuntan a pedidos que existen
-Las entregas están asignadas a usuarios con role: 'courier'

El sistema maneja relaciones entre entidades para simular un flujo de logística real:

User (cliente) ──hace──→ Order (pedido)
↓
genera una
↓
Delivery (entrega) ←──asignada a── User (repartidor)


** Mapeo de Roles (Mocking): Todos los endpoints de mocking respetan este mapeo y usan las constantes definidas (nunca strings sueltos).

#Validaciones de Relaciones

- Un **pedido** solo puede asociarse a un usuario con `role: 'user'` (cliente)
- Una **entrega** solo puede asignarse a un usuario con `role: 'courier'` (repartidor)
- Los **totales** de los pedidos se calculan sumando `precio × cantidad` de cada item
- La fecha de entrega (`deliveredAt`) solo se llena si el estado es `'delivered'`


            ** Decisiones de Diseño**

¿Por qué separar Service y Repository?
El Repository encapsula cómo se accede a los datos (proyecciones, ordenamiento, filtros técnicos).
Ejemplo: "Traeme todos los productos ordenados por fecha, sin el campo __v". En cambio el service encapsula qué hacer con esos datos (reglas de negocio, validaciones). Ejemplo: "De esos productos, solo mostrame los que tengan stock > 0".
Otra forma en como lo entendi es pensar en un restaurante, en donde el Controller, hace de mozo que toma el pedido (recibe la petición), luego el Service, es el chef que decide como cocinar (Aplica la logica de negocios) y el repository, es la despensa donde estan los ingreientes (comunicacion con MongoDB, para guardar, buscar, actualizar). Además, solo el repositity sabe que existe MongoDB, en caso de cambiar a otra base de datos solo deberia modificar este arachivo.

Esta separación permite:
Cambiar la base de datos sin tocar la lógica de negocio,
Testear reglas de negocio sin base de datos (usando mocks del Repository)
Reutilizar la misma lógica desde diferentes puntos de entrada (HTTP, CLI, cron jobs). 

Tecnologías
Node.js + Express 5: Framework web
MongoDB + Mongoose 9: Base de datos NoSQL
dotenv: Gestión de variables de entorno
ESM: Módulos modernos de JavaScript (import/export)
Autor: Rodolfo Fernández - @RodoFM

Proyecto desarrollado como parte del curso de Backend3 de CoderHouse (Profesor Nicolas Oriti)