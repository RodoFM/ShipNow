import { faker } from '@faker-js/faker';
import { USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS,} from '../constants/index.js';

// El Mock Service GENERA los datos falsos (lógica de negocio).
// NO guarda nada en la base: eso es tarea del Repository.
class MockService {
  
  generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      name: `${firstName} ${lastName}`,
      // email coherente con el nombre, en minúsculas y sin espacios
      email: faker.internet
        .email({ firstName, lastName })
        .toLowerCase(),
      password: faker.internet.password({ length: 8 }),
      // Elegimos un rol válido usando las CONSTANTES 
      role: faker.helpers.arrayElement([
        USER_ROLES.USER,     // cliente
        USER_ROLES.COURIER,  // repartidor
      ]),
      active: true,
    };
  }

  // Genera un array de x canridad de usuarios
  generateUsers(qty = 1) {
    return Array.from({ length: qty }, () => this.generateUser());
  }

  // Genera solo repartidores (role: courier) — para asignar entregas
  generateCouriers(qty = 1) {
    return Array.from({ length: qty }, () => ({
      ...this.generateUser(),
      role: USER_ROLES.COURIER, // forzamos el rol repartidor
    }));
  }

  // ────────────────────────────────────────────────
  // PEDIDOS (Orders)
  // Necesita IDs de usuarios reales para respetar la relación pedido ↔ usuario.
  // Si no le pasamos userIds, genera un ObjectId falso.
  // ────────────────────────────────────────────────
  generateOrder(userIds = []) {
    // Generamos entre 1 y 4 items por pedido
    const itemsCount = faker.number.int({ min: 1, max: 4 });
    const items = Array.from({ length: itemsCount }, () => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const price = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
      return {
        product: faker.database.mongodbObjectId(), // ID de producto simulado
        quantity,
        price,
      };
    });

    // El total = suma de (precio * cantidad) de cada item
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      // Si hay usuarios reales, elegimos uno; si no, generamos un ID falso
      user:
        userIds.length > 0
          ? faker.helpers.arrayElement(userIds)
          : faker.database.mongodbObjectId(),
      items,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
      priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: 'Argentina',
      },
    };
  }

  generateOrders(qty = 1, userIds = []) {
    return Array.from({ length: qty }, () => this.generateOrder(userIds));
  }

  // ────────────────────────────────────────────────
  // ENTREGAS (Deliveries)
  // Respeta relaciones: entrega/pedido, y courier con rol coherente.
  // ────────────────────────────────────────────────
  generateDelivery(orderIds = [], courierIds = []) {
    const status = faker.helpers.arrayElement(Object.values(DELIVERY_STATUS));

    return {
      order:
        orderIds.length > 0
          ? faker.helpers.arrayElement(orderIds)
          : faker.database.mongodbObjectId(),
      // El courier es opcional: a veces la entrega aún no fue asignada
      courier:
        courierIds.length > 0
          ? faker.helpers.arrayElement(courierIds)
          : null,
      status,
      // Si ya fue entregada, ponemos fecha de entrega
      deliveredAt:
        status === DELIVERY_STATUS.DELIVERED ? faker.date.recent() : null,
      deliveryAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: 'Argentina',
      },
      notes: faker.helpers.arrayElement([
        'Tocar timbre',
        'Dejar en portería',
        'Llamar al llegar',
        '',
      ]),
    };
  }

  generateDeliveries(qty = 1, orderIds = [], courierIds = []) {
    return Array.from({ length: qty }, () =>
      this.generateDelivery(orderIds, courierIds)
    );
  }
}

export default new MockService();