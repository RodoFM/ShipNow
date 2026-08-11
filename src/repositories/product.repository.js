import Product from '../models/product.model.js';

class ProductRepository {
  // Traer todos los productos 
  getAll(filter = {}) {
    return Product.find(filter)
      .select('-__v')           // Ocultamos el campo interno __v de Mongoose
      .sort({ createdAt: -1 }); // Ordenamos: los más nuevos primero
  }

  // Traer un producto por su ID
  getById(id) {
    return Product.findById(id).select('-__v');
  }

  // Crear un producto nuevo
  create(productData) {
    return Product.create(productData);
  }

  // Actualizar un producto existente
  update(id, changes) {
    return Product.findByIdAndUpdate(id, changes, {
      new: true,            // Devuelve el documento YA actualizado
      runValidators: true,  // Vuelve a validar según el schema
    }).select('-__v');
  }

  // Eliminar un producto
  delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();