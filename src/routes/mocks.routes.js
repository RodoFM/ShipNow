import { Router } from 'express';
import MockController from '../controllers/mock.controller.js';

const router = Router();

// ── GET: generar datos sin guardarlos ──
router.get('/users', MockController.generateUsers);           // GET /api/mocks/users?qty=5
router.get('/orders', MockController.generateOrders);         // GET /api/mocks/orders?qty=3
router.get('/deliveries', MockController.generateDeliveries); // GET /api/mocks/deliveries?qty=3

// ── POST: insertar datos de prueba en MongoDB ──
router.post('/seed', MockController.seedDatabase);            // POST /api/mocks/seed?qty=10

export default router;