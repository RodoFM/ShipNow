//Los archivos de routes/ quedan mínimos: solo conectan el path con el método del Controller

import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';

const router = Router();

// Cada ruta solo conecta el path con el método del Controller
router.get('/', ProductController.getAll);        // GET    /products
router.get('/:id', ProductController.getById);    // GET    /products/:id
router.post('/', ProductController.create);       // POST   /products
router.put('/:id', ProductController.update);     // PUT    /products/:id
router.delete('/:id', ProductController.delete);  // DELETE /products/:id

export default router;