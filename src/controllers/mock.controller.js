import MockService from '../services/mock.service.js';
import MockRepository from '../repositories/mock.repository.js';
import { USER_ROLES } from '../constants/index.js';
import logger from '../config/logger.js';
import {
  InvalidMockQuantityError,
  DatabaseInsertionError,
} from '../errors/index.js';


// HELPER (función suelta, NO usa 'this')
// Valida la cantidad. Lanza InvalidMockQuantityError si es inválida.

function validateQuantity(qty) {
  const parsed = parseInt(qty);

  // Debe ser número válido, positivo (>= 1) y razonable (<= 100)
  if (isNaN(parsed) || parsed < 1 || parsed > 100) {
    throw new InvalidMockQuantityError(qty);
  }

  return parsed;
}

class MockController {
  // GET /api/mocks/users?qty=N  → genera usuarios SIN guardarlos
  async generateUsers(req, res, next) {
    try {
      const qty = validateQuantity(req.query.qty ?? 5);
      const users = MockService.generateUsers(qty);
      logger.info(`Mock: se generaron ${users.length} usuarios (sin persistir)`);
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mocks/orders?qty=N  → genera pedidos SIN guardarlos
  async generateOrders(req, res, next) {
    try {
      const qty = validateQuantity(req.query.qty ?? 3);
      const orders = MockService.generateOrders(qty);
      logger.info(`Mock: se generaron ${orders.length} pedidos (sin persistir)`);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mocks/deliveries?qty=N  → genera entregas SIN guardarlas
  async generateDeliveries(req, res, next) {
    try {
      const qty = validateQuantity(req.query.qty ?? 3);
      const deliveries = MockService.generateDeliveries(qty);
      logger.info(`Mock: se generaron ${deliveries.length} entregas (sin persistir)`);
      return res.status(200).json(deliveries);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/mocks/seed?qty=N  → inserta datos de prueba EN LA BASE
  // Orden: usuarios → pedidos → entregas
  async seedDatabase(req, res, next) {
    try {
      const qty = validateQuantity(req.query.qty ?? 10);
      logger.info(`Mock seed: iniciando carga de datos de prueba (qty=${qty})`);

      // PASO 1: usuarios (clientes + repartidores)
      let insertedUsers;
      try {
        const usersData = MockService.generateUsers(qty);
        const couriersData = MockService.generateCouriers(Math.ceil(qty / 3));
        const allUsersData = [...usersData, ...couriersData];
        insertedUsers = await MockRepository.insertUsers(allUsersData);
      } catch (dbError) {
        throw new DatabaseInsertionError('users', dbError);
      }

      // Separamos IDs por rol 
      const clientIds = insertedUsers
        .filter((u) => u.role === USER_ROLES.USER)
        .map((u) => u._id);
      const courierIds = insertedUsers
        .filter((u) => u.role === USER_ROLES.COURIER)
        .map((u) => u._id);

      // PASO 2: pedidos (asociados a clientes)
      let insertedOrders;
      try {
        const ordersQty = Math.ceil(qty * 1.5);
        const ordersData = MockService.generateOrders(ordersQty, clientIds);
        insertedOrders = await MockRepository.insertOrders(ordersData);
      } catch (dbError) {
        throw new DatabaseInsertionError('orders', dbError);
      }

      const orderIds = insertedOrders.map((o) => o._id);

      // PASO 3: entregas (asociadas a pedidos y repartidores)
      let insertedDeliveries;
      try {
        const deliveriesData = MockService.generateDeliveries(
          insertedOrders.length,
          orderIds,
          courierIds
        );
        insertedDeliveries = await MockRepository.insertDeliveries(deliveriesData);
      } catch (dbError) {
        throw new DatabaseInsertionError('deliveries', dbError);
      }

      logger.info(
        `Mock seed: OK → ${insertedUsers.length} usuarios, ${insertedOrders.length} pedidos, ${insertedDeliveries.length} entregas`
      );

      return res.status(201).json({
        message: 'Datos de prueba insertados correctamente',
        insertados: {
          usuarios: insertedUsers.length,
          pedidos: insertedOrders.length,
          entregas: insertedDeliveries.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MockController();