import logger from '../config/logger.js';


// CONTROLLER DE PRUEBA DEL LOGGER 
// NO es una funcionalidad del negocio: es una herramienta interna (no confundir)
// para verificar rápidamente que TODOS los niveles de log funcionan
// y aparecen donde corresponde (consola, error.log, combined.log).

class LoggerController {
  // GET /api/logger-test
  testLevels(req, res) {
    logger.debug('LOGGER TEST → nivel DEBUG (detalle de desarrollo)');
    logger.http('LOGGER TEST → nivel HTTP (petición entrante)');
    logger.info('LOGGER TEST → nivel INFO (información general)');
    logger.warning('LOGGER TEST → nivel WARNING (advertencia)');
    logger.error('LOGGER TEST → nivel ERROR (error del servidor)');
    logger.fatal('LOGGER TEST → nivel FATAL (falla crítica)');

    return res.status(200).json({
      success: true,
      message:
        'Se generaron logs en todos los niveles. Revisá la consola y la carpeta /logs.',
      niveles: ['debug', 'http', 'info', 'warning', 'error', 'fatal'],
      nota: 'Solo error y fatal se persisten en error-<fecha>.log; todos quedan en combined-<fecha>.log.',
    });
  }
}

export default new LoggerController();