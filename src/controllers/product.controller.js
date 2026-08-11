//Puerta de entrada HTTPde la app, recibe las requests y devuelve las responses. No tiene lógica de negocio, solo llama al Service y devuelve la respuesta. 
import ProductService from '../services/product.service.js';

// Recibe req, llama al Service y responde con res + status code.
class ProductController {
  // GET /products  (opcional: ?onlyAvailable=true)
  async getAll(req, res) {
    try {
      const onlyAvailable = req.query.onlyAvailable === 'true';
      const products = await ProductService.getAll({ onlyAvailable });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // GET /products/:id
  async getById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      // Si el Service lanzó "no encontrado", respondemos 404
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /products
  async create(req, res) {
    try {
      const newProduct = await ProductService.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // PUT /products/:id
  async update(req, res) {
    try {
      const updated = await ProductService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }

  // DELETE /products/:id
  async delete(req, res) {
    try {
      await ProductService.delete(req.params.id);
      return res.status(204).send(); // 204 = éxito sin contenido que devolver
    } catch (error) {
      if (error.message === 'Producto no encontrado') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new ProductController();