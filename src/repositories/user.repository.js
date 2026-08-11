import User from '../models/user.model.js';


class UserRepository {
  // Traer todos los usuarios (con filtro opcional)
  getAll(filter = {}) {
    return User.find(filter)
      .select('-__v -password')    // Ocultamos __v y la contraseña
      .sort({ createdAt: -1 });    // Más nuevos primero
  }

  // Traer un usuario por su ID
  getById(id) {
    return User.findById(id).select('-__v -password');
  }

  // Traer un usuario por email (útil para login, ampplia la forma de llgar al usuario)
  getByEmail(email) {
    return User.findOne({ email }).select('-__v');
  }

  // Crear un usuario nuevo
  create(userData) {
    return User.create(userData);
  }

  // Actualizar un usuario existente
  update(id, changes) {
    return User.findByIdAndUpdate(id, changes, {
      new: true,
      runValidators: true,
    }).select('-__v -password');
  }

  // Eliminar un usuario
  delete(id) {
    return User.findByIdAndDelete(id);
  }
}

export default new UserRepository();