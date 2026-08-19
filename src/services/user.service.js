//El Service contiene la LÓGICA DE NEGOCIO (las reglas de la app, recordatorio para mi...borrar para proyecto final)
import UserRepository from '../repositories/user.repository.js';
import { UserNotFoundError, DuplicateEmailError } from '../errors/index.js';

class UserService {
  // Traer todos los usuarios
  
  async getAll({ onlyActive = false } = {}) {
    const filter = onlyActive ? { active: true } : {};
    return UserRepository.getAll(filter);
  }

  // Traer un usuario por ID (con validación de "no encontrado")
  async getById(id) {
    const user = await UserRepository.getById(id);

    if (!user) {
      throw new UserNotFoundError(id); 
    }
    return user;
  }

  // Crear un usuario nuevo
  // verificar que el email no esté registrado
  async create(userData) {
    const existingUser = await UserRepository.getByEmail(userData.email);

    if (existingUser) {
      throw new DuplicateEmailError(userData.email);
    }
    return UserRepository.create(userData);
  }

  // Actualizar un usuario
  async update(id, changes) {
    // Verificamos que el usuario exista (lanza UserNotFoundError si no)
    await this.getById(id);

    // Si están cambiando el email, verificar que no esté en uso
    if (changes.email) {
      const existingUser = await UserRepository.getByEmail(changes.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new DuplicateEmailError(changes.email); 
      }
    }

    // No permitimos actualizar la contraseña por esta vía
    delete changes.password;
    return UserRepository.update(id, changes);
  }

  // Eliminar un usuario (verificando que exista primero)
  async delete(id) {
    await this.getById(id);
    return UserRepository.delete(id);
  }
}

export default new UserService();