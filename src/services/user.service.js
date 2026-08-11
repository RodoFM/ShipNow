//LOGIOCA DE NEGOCIO
import UserRepository from '../repositories/user.repository.js';


class UserService {
  // Traer todos los usuarios
  // Regla de negocio: opcionalmente solo los activos, opcion de filrto
  async getAll({ onlyActive = false } = {}) {
    const filter = onlyActive ? { active: true } : {};
    return UserRepository.getAll(filter);
  }

  // Traer un usuario por ID (con validación de "no encontrado")
  async getById(id) {
    const user = await UserRepository.getById(id);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  // Crear un usuario nuevo
  // Regla de negocio: verificar que el email no esté registrado
  async create(userData) {
    const existingUser = await UserRepository.getByEmail(userData.email);

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    return UserRepository.create(userData);
  }

  // Actualizar un usuario
  async update(id, changes) {
    // Verificamos que el usuario exista
    await this.getById(id);

    // Si están cambiando el email, verificar que no esté en uso
    if (changes.email) {
      const existingUser = await UserRepository.getByEmail(changes.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error('El email ya está registrado por otro usuario');
      }
    }

    // No permitimos actualizar la contraseña por esta vía (debería ser otra ruta)
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