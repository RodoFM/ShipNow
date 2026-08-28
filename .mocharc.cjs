// Configuración de Mocha (CommonJS porque el proyecto usa "type": "module")
const path = require('path');

module.exports = {
  spec: './test/**/*.test.js',                          // archivos de test a ejecutar
  timeout: 10000,                                        // 10 s por test
  exit: true,                                            // cierra el proceso al terminar
  require: [path.resolve(__dirname, 'test/setup.js')],  // ruta ABSOLUTA a los root hooks
};
