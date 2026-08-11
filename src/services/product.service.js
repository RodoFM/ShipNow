import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

// El Service contiene la LÓGICA DE NEGOCIO (las reglas de la app, recordatorio para mi...borrar para proyecto final)
class ProductService {
  // Regla de negocio: si piden solo disponibles, filtramos los que no tienen stock.
  async getAll({ onlyAvailable = false } = {}) {
    const products = await ProductRepository.getAll();

    if (onlyAvailable) {
      // Filtramos productos sin stock o descontinuados
      return products.filter(
        (product) =>
          product.stock > 0 && product.status === PRODUCT_STATUS.AVAILABLE
      );
    }

    return products;
  }

  // Traer un producto por ID (con validación de "no encontrado")
  async getById(id) {
    const product = await ProductRepository.getById(id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return product;
  }

  // Crear un producto nuevo.
  // Regla de negocio: si no tiene stock, lo marcamos como OUT_OF_STOCK automáticamente.
  async create(productData) {
    if (productData.stock === 0) {
      productData.status = PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return ProductRepository.create(productData);
  }

  // Actualizar un producto.
  // Regla de negocio: mantenemos el status coherente con el stock.
  async update(id, changes) {
    // Primero verificamos que el producto exista, sino OUT-OF-STOCK
    await this.getById(id);

    if (changes.stock !== undefined) {
      changes.status =
        changes.stock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return ProductRepository.update(id, changes);
  }

  // Eliminar un producto (verificando que exista primero)
  async delete(id) {
    await this.getById(id);
    return ProductRepository.delete(id);
  }
}

export default new ProductService();