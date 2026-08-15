import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Delivery from '../models/delivery.model.js';

// El Mock Repository es el ÚNICO que habla con MongoDB en este módulo.
// Recibe los datos ya generados (desde el Service) y los inserta.
class MockRepository {
  // Inserta un array de usuarios y devuelve los documentos creados (con _id)
  insertUsers(users) {
    return User.insertMany(users);
  }

  // Inserta un array de pedidos
  insertOrders(orders) {
    return Order.insertMany(orders);
  }

  // Inserta un array de entregas
  insertDeliveries(deliveries) {
    return Delivery.insertMany(deliveries);
  }

  //Helpers para traer IDs existentes (para respetar relaciones)

  // Trae los IDs de usuarios que son clientes (role: user)
  getUserIdsByRole(role) {
    return User.find({ role }).select('_id').lean();
  }

  // Trae los IDs de todos los pedidos existentes
  getOrderIds() {
    return Order.find().select('_id').lean();
  }
}

export default new MockRepository();