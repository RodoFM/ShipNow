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


##Sistema de Logging y Monitoreo (Módulo4)

Se incorpora un sistema de logging profesional con **[Winston](https://github.com/winstonjs/winston)**, reemplazando los `console.log()` dispersos por un logger centralizado que registra eventos con distintos niveles de importancia, tanto en consola como en archivos con rotación.

##Herramienta utilizada

- **winston**: logger principal
- **winston-daily-rotate-file**: rotación de archivos de log por fecha

##Niveles de log

De mayor a menor gravedad (cada nivel incluye a los superiores):

Nivel	  Uso
fatal	  Fallas críticas (ej: no se puede conectar a MongoDB al iniciar)
error	  Errores inesperados del servidor (bugs, fallas de inserción en DB)
warning	Errores de negocio esperados (usuario no encontrado, qty inválida, ruta inexistente)
info	  Eventos importantes (servidor iniciado, conexión a MongoDB, seed exitoso, usuario creado)
http	  Registro de cada petición entrante
debug	  Detalle fino, solo visible en desarrollo

Comportamiento según el entorno
El nivel se ajusta con la variable NODE_ENV:
development: muestra desde debug (todos los niveles).
production: muestra desde info (oculta debug y http).

-Dónde se guardan los logs: Los archivos se generan en la carpeta /logs (en la raíz del proyecto):

Archivo	              Contenido
error-<fecha>.log	    Solo niveles error y fatal
combined-<fecha>.log	Todos los niveles (historial completo)

Rotación: los archivos rotan por día (YYYY-MM-DD), se conservan 14 días y rotan también si superan 10 MB.

-Archivos ignorados en Git
En .gitignore se ignoran:
node_modules
.env
logs/*
!logs/.gitkeep

La carpeta logs/ se conserva en el repo mediante un archivo vacío logs/.gitkeep, pero los archivos de log generados por la aplicación NO se suben a GitHub.

Endpoint de prueba del logger
Para verificar que todos los niveles funcionan:

bash
curl http://localhost:3000/api/logger-test
Esto genera un log en cada nivel (debug, http, info, warning, error, fatal). Revisá:

La consola (verás los 6 niveles con colores).
logs/error-<fecha>.log (solo aparecerán error y fatal).
logs/combined-<fecha>.log (aparecerán los 6 niveles).

##Ejemplo de salida (consola y archivo)##
2026-08-01 10:12:03 [info]     Servidor ShipNow escuchando en el puerto 3000
2026-08-01 10:12:03 [info]     Conexión a MongoDB establecida
2026-08-01 10:14:21 [warning]  Pedido #A-102 sin repartidor asignado
2026-08-01 10:15:09 [error]    Falló la creación del pedido: ValidationError (campo "destino" requerido)


-Integración con el manejo de errores (Módulo 3)
El middleware global de errores ahora también registra cada error con Winston:

Errores de negocio (AppError con status < 500) → se loguean como warning.
Errores operacionales 5xx (ej: DATABASE_INSERTION_ERROR) → se loguean como error.
Errores no controlados (bugs) → se loguean como error con el stack completo.
Fallo de conexión inicial a MongoDB → se loguea como fatal.

El logger no reemplaza al manejo de errores: lo complementa. La respuesta al cliente sigue siendo la misma estructura uniforme del Módulo 3.


## Documentación de la API con Swagger (Módulo 5)

El **Módulo 5** incorpora documentación técnica interactiva con **[Swagger UI](https://swagger.io/tools/swagger-ui/) / OpenAPI 3.0**, donde se pueden consultar y **probar** todos los endpoints principales desde el navegador.

###Ruta de acceso

Con el servidor corriendo, la documentación está disponible en:
http://localhost:3000/api/docs

También se expone el documento OpenAPI en formato JSON (útil para importar en Postman/Insomnia):
http://localhost:3000/api/docs.json


### Cómo levantar el servidor

bash
# 1) Instalar dependencias
npm install

# 2) Crear el archivo .env (ver .env.example) con PORT, MONGODB_URI y NODE_ENV

# 3) Arrancar el servidor
node src/index.js

Luego abrí http://localhost:3000/api/docs en el navegador.

Módulos documentados (agrupados por tags)
Tag     	Contenido
Users	    CRUD completo de usuarios (GET, GET/:id, POST, PUT, DELETE)
Products	CRUD completo de productos (GET, GET/:id, POST, PUT, DELETE)
Mocks	    Generación de datos de prueba (users/orders/deliveries) e inserción en la base (seed)
Logger	  Endpoint de prueba del logger (herramienta interna, no es funcionalidad de negocio)

Cada endpoint documenta: método HTTP, ruta, descripción, parámetros (de ruta y query), body esperado, respuesta exitosa y posibles errores.

Schemas reutilizables
Se definen schemas reutilizables (referenciados con $ref) para las entidades y respuestas:

User / UserInput
Product / ProductInput
Order y OrderItem (item de pedido)
Delivery
Address (dirección, compartida por Order y Delivery)
ErrorResponse (estructura uniforme de error del Módulo 3)
SuccessResponse (respuesta exitosa genérica, ej: seed)

**Errores documentados (coinciden con los reales)
La documentación refleja exactamente los errores que devuelve la API:

Código	                                                  Situación
VALIDATION_ERROR	                                        Datos inválidos
USER_NOT_FOUND / PRODUCT_NOT_FOUND / ROUTE_NOT_FOUND	    Recurso o ruta no encontrada (404)
DUPLICATE_EMAIL                                        	  Email ya registrado (409)
INVALID_MOCK_QUANTITY	                                    Cantidad inválida en mocks (fuera de 1–100)
DATABASE_INSERTION_ERROR / INTERNAL_ERROR	                Error interno del servidor (500)

**Organización (configuración separada de las rutas)
La configuración de Swagger vive en su propia carpeta, separada de la lógica de rutas:

src/docs/
├── swagger.js            → arma el documento OpenAPI y monta Swagger UI
├── components.js         → schemas y respuestas de error reutilizables
└── paths/
    ├── users.paths.js
    ├── products.paths.js
    ├── mocks.paths.js
    └── logger.paths.js

En index.js solo se llama a setupSwagger(app), sin ensuciar las rutas del negocio.

**Nota sobre Pedidos y Entregas: los modelos Order y Delivery existen y se generan mediante el módulo de Mocks, pero todavía no tienen endpoints CRUD propios. Por eso sus schemas están documentados (aparecen en las respuestas de mocks), pero no hay tags Orders/Deliveries con rutas propias: la documentación refleja la API real.***

--Testing Funcional Automatizado (Módulo 6)--

El **Módulo 6** incorpora una suite de **tests funcionales automatizados** que verifican el comportamiento real de la API de punta a punta (peticiones HTTP reales contra la app Express), usando una **base de datos de testing separada** para no tocar los datos de desarrollo.

##Herramientas utilizadas

| Herramienta                                       | Rol 
[Mocha](https://mochajs.org/)                       | Framework de testing (organiza y corre los tests) 
[Chai](https://www.chaijs.com/)                     | Librería de aserciones (`expect`) 
[Supertest](https://github.com/ladjs/supertest)     | Realiza peticiones HTTP reales a la app Express sin abrir un puerto 
[cross-env](https://github.com/kentcdodds/cross-env)| Setea `NODE_ENV=test` de forma multiplataforma (Windows/Linux/Mac) 

##Entorno de testing separado

Para garantizar **datos controlados y repetibles**, el testing corre totalmente aislado del entorno de desarrollo:

- **Archivo `.env.test`**: define una base de datos exclusiva para tests.
  ```env
  PORT=3001
  MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_test
  NODE_ENV=test
  ```

- Cuando `NODE_ENV=test`, `src/config/env.config.js` carga automáticamente `.env.test` en vez de `.env`, por lo que *los tests nunca tocan la base de datos de desarrollo*.
- **`src/app.js` separado del servidor*: la app Express (rutas + middlewares) se define en `src/app.js` *sin* llamar a `connectDB()` ni a `app.listen()`. Esto permite *importar la app en los tests* sin abrir un puerto real. `src/index.js` solo se encarga de conectar la BD y levantar el servidor en producción/desarrollo.

##Datos controlados y repetibles

Los *root hooks* de Mocha viven en `test/setup.js` y garantizan aislamiento total entre tests:

| Hook        | Cuándo corre                      | Qué hace 
| `beforeAll` | 1 vez, al inicio de toda la suite | Conecta a la BD de test 
| `afterAll`  | 1 vez, al final de toda la suite  | Desconecta de la BD 
| `beforeEach`| Antes de *cada* test              | *Limpia todas las colecciones* cada test parte de una BD vacía y no depende del anterior   

Esto asegura que los tests sean **repetibles** (mismo resultado siempre) e **independientes** entre sí.

##Estructura de los tests

test/
├── setup.js            → root hooks (conexión + limpieza automática entre tests)
├── users.test.js       → CRUD de usuarios + errores (404, 409)
├── products.test.js    → CRUD de productos + lógica de status según stock + errores (404)
├── mocks.test.js       → generación de mocks (users/orders/deliveries) + seed + validación de qty
├── logger.test.js      → endpoint de prueba del logger (estructura de respuesta)
└── general.test.js     → ruta raíz, documentación (/api/docs.json) y rutas inexistentes (404)


##Cobertura de casos

Los tests cubren *todos los endpoints reales* de la API, con *casos exitosos y de error*:

- **Usuarios** (`/api/users`): listar (vacío / con datos / filtrado por activos), crear (201), email duplicado (409), obtener por ID (200 / 404), actualizar (200 / 404 / 409), eliminar (204 / 404).
- **Productos** (`/api/products`): listar (vacío / con datos / filtrado por disponibles), crear (201) con status automático según stock, obtener por ID (200 / 404), actualizar (200 / 404) con recálculo de status, eliminar (204 / 404).
- **Mocks** (`/api/mocks`): generar users/orders/deliveries con qty por defecto y personalizada, validación de cantidad (0, >100, no numérica → 400), verificación de que los GET **no persisten**, y seed que **sí persiste** (201).
- **Logger** (`/api/logger-test`): estructura de respuesta y niveles de log.
- **Generales**: ruta raíz `/`, documentación OpenAPI `/api/docs.json`, y rutas inexistentes → 404 `ROUTE_NOT_FOUND`.

###Cómo correr los tests

**Requisito previo:** tener *MongoDB corriendo* localmente (los tests usan la base `shipnow_test`, que se crea sola).

```bash
# 1) Instalar dependencias (si no lo hiciste aún)
npm install

# 2) Correr toda la suite de tests
npm test
```

El script `test` de `package.json` ejecuta:

```json
"test": "cross-env NODE_ENV=test mocha"
```

`cross-env` setea `NODE_ENV=test` (por lo que se carga `.env.test`), y Mocha toma la configuración de `.mocharc.cjs` (archivos de test, timeout y carga de los root hooks).

##Resultado esperado

```
  🌐 General — Raíz, Documentación y 404
    ✔ ... (varios tests)
  📋 Logger — /api/logger-test
    ✔ ... 
  🎲 Mocks — /api/mocks
    ✔ ...
  📦 Products — /api/products
    ✔ ...
  👤 Users — /api/users
    ✔ ...

  62 passing (557ms)
```

**Nota:** como no existen endpoints CRUD propios de `Order`/`Delivery` (solo se generan vía Mocks), sus casos se cubren dentro de los tests de **Mocks** (generación y seed), reflejando la API **real**.


              ##Sistema de Subida de Archivos con Multer (Módulo 7)

El *Módulo 7* incorpora un sistema de **carga de archivos** (documentos de usuario y comprobantes de pedidos/entregas) usando **[Multer](https://github.com/expressjs/multer)**, con la configuración **centralizada** y separada de los routers, validaciones conectadas al sistema de errores del proyecto y documentación en Swagger.

##Herramienta utilizada

Herramienta   	Rol
Multer        	Middleware para procesar multipart/form-data (subida de archivos)

-Endpoints disponibles
Método	Endpoint	                           Campo (form-data)	Tipos válidos (documentType)	  Carpeta destino
POST	  /api/uploads/users/:id/documents	    document	        dni, licencia, contrato	        uploads/documents/
POST	  /api/uploads/orders/:id/receipts	    receipt	          comprobante, foto, firma	      uploads/receipts/
POST	  /api/uploads/deliveries/:id/receipts	receipt	          comprobante, foto, firma	      uploads/receipts/

*Validaciones aplicadas*
-Tipos MIME permitidos: image/jpeg, image/png, application/pdf
-Tamaño máximo: 5 MB por archivo
-Archivo requerido: debe adjuntarse el archivo en el campo correcto
-documentType válido: según la tabla de arriba (usa constantes, nunca strings sueltos)
-La entidad debe existir: el usuario/pedido/entrega debe estar en la base de datos


**Solo metadata en la base de datos**
El archivo físico NUNCA se guarda en MongoDB. Solo se almacena su metadata (originalName, generatedName, path, mimetype, size, documentType, uploadedAt) en un array dentro de la entidad correspondiente (User.documents[], Order.receipts[], Delivery.receipts[]). El archivo real queda en disco bajo uploads/, con un nombre único (timestamp-uuid.ext) para evitar colisiones.

**Configuración centralizada (separada de las rutas)**
La configuración de Multer vive en un único archivo, fuera de los routers:

src/config/multer.config.js   → storage, fileFilter (MIME), limits (tamaño) y handleMulterError
El wrapper handleMulterError convierte los errores propios de Multer (ej: LIMIT_FILE_SIZE) a los errores personalizados del proyecto (FileSizeLimitError, etc.), para que el middleware global de errores (Módulo 3) los responda con el mismo formato uniforme que el resto de la API.

Errores documentados (formato estándar)
Código	                                                HTTP	            Situación
FILE_REQUIRED	                                          400	              No se adjuntó archivo
INVALID_FILE_TYPE	                                      400	              Tipo MIME no permitido
INVALID_DOCUMENT_TYPE	                                  400	              documentType fuera de los valores aceptados
FILE_TOO_LARGE	                                        413	               El archivo supera los 5 MB
USER_NOT_FOUND / ORDER_NOT_FOUND / DELIVERY_NOT_FOUND	  404	               La entidad no existe

*Archivos ignorados en Git**
Al igual que con los logs, los archivos subidos no se suben al repositorio. En .gitignore:

uploads/*
!uploads/.gitkeep
La carpeta uploads/ se conserva en el repo mediante uploads/.gitkeep, pero los archivos subidos por los usuarios quedan fuera del control de versiones.

Ejemplo de uso
bash
#Subir el DNI (PDF) de un usuario existente
curl -X POST http://localhost:3000/api/uploads/users/<userId>/documents \
  -F "documentType=dni" \
  -F "document=@/ruta/a/mi_dni.pdf"
Respuesta esperada (201):

json
{
  "success": true,
  "message": "Documento cargado y asociado al usuario correctamente",
  "document": {
    "originalName": "mi_dni.pdf",
    "generatedName": "1787880063400-6e236527c438.pdf",
    "path": "uploads/documents/1787880063400-6e236527c438.pdf",
    "mimetype": "application/pdf",
    "size": 204800,
    "documentType": "dni",
    "uploadedAt": "2026-08-30T12:00:00.000Z"
  },
  "userId": "..."
}
 También puedes probar los tres endpoints de forma interactiva desde Swagger UI en http://localhost:3000/api/docs (tag Uploads), que renderiza el selector de archivos gracias a la documentación multipart/form-data.


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