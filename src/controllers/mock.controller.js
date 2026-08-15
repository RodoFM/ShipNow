import MockService from '../services/mock.service.js';
import MockRepository from '../repositories/mock.repository.js';
import { USER_ROLES } from '../constants/index.js';


class MockController {
  // ────────────────────────────────────────────────
  // GET /api/mocks/users?qty=N
  // Genera usuarios SIN guardarlos en la base
  // ────────────────────────────────────────────────
  async generateUsers(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 5;
      const users = MockService.generateUsers(qty);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ────────────────────────────────────────────────
  // GET /api/mocks/orders?qty=N
  // Genera pedidos SIN guardarlos (con IDs falsos)
  // ────────────────────────────────────────────────
  async generateOrders(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 3;
      const orders = MockService.generateOrders(qty);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ────────────────────────────────────────────────
  // GET /api/mocks/deliveries?qty=N
  // Genera entregas SIN guardarlas (con IDs falsos)
  // ────────────────────────────────────────────────
  async generateDeliveries(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 3;
      const deliveries = MockService.generateDeliveries(qty);
      return res.status(200).json(deliveries);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // ────────────────────────────────────────────────
  // POST /api/mocks/seed?qty=N
  // Inserta datos de prueba EN LA BASE respetando relaciones.
  // Orden: usuarios → pedidos → entregas
  // ────────────────────────────────────────────────
  async seedDatabase(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 10;

      // PASO 1: Insertar usuarios (clientes + repartidores)
      const usersData = MockService.generateUsers(qty);
      const couriersData = MockService.generateCouriers(Math.ceil(qty / 3)); // aprox. 33% repartidores
      
      const allUsersData = [...usersData, ...couriersData];
      const insertedUsers = await MockRepository.insertUsers(allUsersData);

      // Separamos los IDs por rol (para respetar relaciones)
      const clientIds = insertedUsers
        .filter((u) => u.role === USER_ROLES.USER)
        .map((u) => u._id);

      const courierIds = insertedUsers
        .filter((u) => u.role === USER_ROLES.COURIER)
        .map((u) => u._id);

      // PASO 2: Insertar pedidos (asociados a clientes)
      const ordersQty = Math.ceil(qty * 1.5); // aprox.1.5 pedidos por cliente
      const ordersData = MockService.generateOrders(ordersQty, clientIds);
      const insertedOrders = await MockRepository.insertOrders(ordersData);

      const orderIds = insertedOrders.map((o) => o._id);

      //PASO 3: Insertar entregas (asociadas a pedidos y repartidores)
      const deliveriesQty = insertedOrders.length; // 1 entrega por pedido
      const deliveriesData = MockService.generateDeliveries(
        deliveriesQty,
        orderIds,
        courierIds
      );
      const insertedDeliveries = await MockRepository.insertDeliveries(
        deliveriesData
      );

      // ── Respuesta ──
      return res.status(201).json({
        message: 'Datos de prueba insertados correctamente',
        insertados: {
          usuarios: insertedUsers.length,
          pedidos: insertedOrders.length,
          entregas: insertedDeliveries.length,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new MockController();