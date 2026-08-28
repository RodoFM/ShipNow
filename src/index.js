// INDEX.JS — Punto de entrada de la aplicación.
// Solo conecta la BD y levanta el servidor. La app Express vive en app.js (separada para que los tests la importen sin abrir un puerto real).
import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/index.js';

// ── Conectar a MongoDB y arrancar el servidor ──
connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Servidor ShipNow escuchando en el puerto ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Falló la conexión a MongoDB, el servidor no se inició:', error.message);
    process.exit(1);
  });