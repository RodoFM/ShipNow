//Puerta de entrada HTTPde la app, recibe las requests y devuelve las responses. No tiene lógica de negocio, solo llama al Service y devuelve la respuesta.

import UserService from '../services/user.service.js';
import logger from '../config/logger.js';

class UserController {
  // GET /users  (opcional: ?onlyActive=true)
  async getAll(req, res, next) {
    try {
      const onlyActive = req.query.onlyActive === 'true';
      const users = await UserService.getAll({ onlyActive });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // GET /users/:id
  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // POST /users
  async create(req, res, next) {
    try {
      const newUser = await UserService.create(req.body);
      logger.info(`Usuario creado correctamente (id: ${newUser._id})`);
      return res.status(201).json(newUser);
    } catch (error) {
      next(error); 
    }
  }

  // PUT /users/:id
  async update(req, res, next) {
    try {
      const updated = await UserService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /users/:id
  async delete(req, res, next) {
    try {
      await UserService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();