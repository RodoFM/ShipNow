//Puerta de entrada HTTPde la app, recibe las requests y devuelve las responses. No tiene lógica de negocio, solo llama al Service y devuelve la respuesta.
import UserService from '../services/user.service.js';

class UserController {
  // GET /users  (opcional: ?onlyActive=true)
  async getAll(req, res) {
    try {
      const onlyActive = req.query.onlyActive === 'true';
      const users = await UserService.getAll({ onlyActive });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET /users/:id
  async getById(req, res) {
    try {
      const user = await UserService.getById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /users
  async create(req, res) {
    try {
      const newUser = await UserService.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      // Si el error es de email duplicado, es un 400 (bad request)
      if (error.message === 'El email ya está registrado') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  // PUT /users/:id
  async update(req, res) {
    try {
      const updated = await UserService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('email ya está registrado')) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  // DELETE /users/:id
  async delete(req, res) {
    try {
      await UserService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();