//Puerta de entrada HTTPde la app, recibe las requests y devuelve las responses. No tiene lógica de negocio, solo llama al Service y devuelve la respuesta. 
import ProductService from '../services/product.service.js';

// Recibe req, llama al Service y responde con res + status code.
class ProductController {
  // GET /products  (opcional: ?onlyAvailable=true)
  async getAll(req, res, next) {
    try {
      const onlyAvailable = req.query.onlyAvailable === 'true';
      const products = await ProductService.getAll({ onlyAvailable });
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  // GET /products/:id
  async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  // POST /products
  async create(req, res, next) {
    try {
      const newProduct = await ProductService.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  // PUT /products/:id
  async update(req, res, next) {
    try {
      const updated = await ProductService.update(req.params.id, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /products/:id
  async delete(req, res, next) {
    try {
      await ProductService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();