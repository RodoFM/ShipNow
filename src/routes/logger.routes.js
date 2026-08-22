import { Router } from 'express';
import LoggerController from '../controllers/logger.controller.js';

const router = Router();

// GET /api/logger-test → genera logs en todos los niveles (herramienta interna)
router.get('/', LoggerController.testLevels);

export default router;