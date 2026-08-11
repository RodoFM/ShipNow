ShipNow (Api de logistica)

API REST profesional construida con arquitectura de 3 capas (Controller-Service-Repository) para gestión de envíos, productos y usuarios.

Arquitectura:

Este proyecto sigue una arquitectura de capas claramente separadas:
src/
├── config/ # Configuración centralizada y validación de entorno
├── constants/ # Diccionario de constantes del dominio
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


                        **Ejemplos de Uso**
Crear un producto
bash:
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse Gamer","price":25.99,"stock":10,"category":"Periféricos"}'

Listar productos disponibles
bash:
curl http://localhost:3000/api/products?onlyAvailable=true

Crear un usuario
bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@test.com","password":"123456","role":"user"}'


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