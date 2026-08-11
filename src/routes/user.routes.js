//Los archivos de routes/ quedan mínimos: solo conectan el path con el método del Controller
import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

// Cada ruta solo conecta el path con el método del Controller
router.get('/', UserController.getAll);        // GET    /users
router.get('/:id', UserController.getById);    // GET    /users/:id
router.post('/', UserController.create);       // POST   /users
router.put('/:id', UserController.update);     // PUT    /users/:id
router.delete('/:id', UserController.delete);  // DELETE /users/:id

export default router;