// Cubre: GET all (con y sin filtro), GET by ID, POST, PUT, DELETE
//        Casos exitosos + casos de error (404)
//        Comportamiento del status según stock (lógica de negocio)
// Cada test parte de una BD limpia gracias al beforeEach de setup.js

import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

// ID con formato ObjectId válido pero que NO existe en la BD de test
const nonExistentId = new mongoose.Types.ObjectId().toString();

// Datos de prueba base
const productData = {
  name: 'Laptop Pro',
  description: 'Laptop profesional de alto rendimiento',
  price: 1500,
  stock: 10,
  category: 'Electrónicos',
};

const anotherProductData = {
  name: 'Mouse Inalámbrico',
  description: 'Mouse ergonómico sin cable',
  price: 35,
  stock: 0,         // sin stock → status debe ser 'out_of_stock' automáticamente
  category: 'Accesorios',
};

// Helper: crea un producto y devuelve el body de la respuesta
async function createProduct(data = productData) {
  const res = await request(app).post('/api/products').send(data);
  return res.body;
}

describe('📦 Products — /api/products', () => {

  // GET /api/products 
  describe('GET /api/products', () => {
    it('debería devolver 200 y un arreglo vacío cuando no hay productos', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('debería devolver 200 con los productos existentes', async () => {
      await createProduct();
      const res = await request(app).get('/api/products');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0].name).to.equal(productData.name);
    });

    it('debería filtrar solo productos disponibles con ?onlyAvailable=true', async () => {
      // Creamos un producto con stock > 0 (available) y uno sin stock (out_of_stock)
      await createProduct(productData);           // stock: 10 → available
      await createProduct(anotherProductData);    // stock: 0  → out_of_stock

      const res = await request(app).get('/api/products?onlyAvailable=true');
      expect(res.status).to.equal(200);
      // Solo debe aparecer el producto con stock > 0
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0].name).to.equal(productData.name);
      expect(res.body[0].status).to.equal('available');
    });
  });

  // POST /api/products 
  describe('POST /api/products', () => {
    it('debería crear un producto y devolver 201 con sus datos', async () => {
      const res = await request(app).post('/api/products').send(productData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal(productData.name);
      expect(res.body.price).to.equal(productData.price);
      expect(res.body.stock).to.equal(productData.stock);
    });

    it('debería asignar status "available" automáticamente si stock > 0', async () => {
      const res = await request(app).post('/api/products').send(productData); // stock: 10
      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('available');
    });

    it('debería asignar status "out_of_stock" automáticamente si stock === 0', async () => {
      const res = await request(app).post('/api/products').send(anotherProductData); // stock: 0
      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('out_of_stock');
    });
  });

  // GET /api/products/:id
  describe('GET /api/products/:id', () => {
    it('debería devolver 200 con los datos del producto si existe', async () => {
      const created = await createProduct();
      const res = await request(app).get(`/api/products/${created._id}`);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(created._id);
      expect(res.body.name).to.equal(productData.name);
      expect(res.body.price).to.equal(productData.price);
    });

    it('debería devolver 404 PRODUCT_NOT_FOUND si el producto no existe', async () => {
      const res = await request(app).get(`/api/products/${nonExistentId}`);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('PRODUCT_NOT_FOUND');
    });
  });

  // PUT /api/products/:id
  describe('PUT /api/products/:id', () => {
    it('debería actualizar el producto y devolver 200 con datos actualizados', async () => {
      const created = await createProduct();
      const res = await request(app)
        .put(`/api/products/${created._id}`)
        .send({ name: 'Laptop Pro Max', price: 2000 });
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Laptop Pro Max');
      expect(res.body.price).to.equal(2000);
    });

    it('debería cambiar status a "out_of_stock" si el stock se actualiza a 0', async () => {
      const created = await createProduct(productData); // stock: 10 (available)
      const res = await request(app)
        .put(`/api/products/${created._id}`)
        .send({ stock: 0 });
      expect(res.status).to.equal(200);
      expect(res.body.stock).to.equal(0);
      expect(res.body.status).to.equal('out_of_stock');
    });

    it('debería cambiar status a "available" si el stock se actualiza a > 0', async () => {
      const created = await createProduct(anotherProductData); // stock: 0 (out_of_stock)
      const res = await request(app)
        .put(`/api/products/${created._id}`)
        .send({ stock: 5 });
      expect(res.status).to.equal(200);
      expect(res.body.stock).to.equal(5);
      expect(res.body.status).to.equal('available');
    });

    it('debería devolver 404 PRODUCT_NOT_FOUND si el producto no existe', async () => {
      const res = await request(app)
        .put(`/api/products/${nonExistentId}`)
        .send({ name: 'Nuevo nombre' });
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('PRODUCT_NOT_FOUND');
    });
  });

  //DELETE /api/products/:id
  describe('DELETE /api/products/:id', () => {
    it('debería eliminar el producto y devolver 204 sin cuerpo', async () => {
      const created = await createProduct();
      const res = await request(app).delete(`/api/products/${created._id}`);
      expect(res.status).to.equal(204);
    });

    it('debería devolver 404 PRODUCT_NOT_FOUND si el producto no existe', async () => {
      const res = await request(app).delete(`/api/products/${nonExistentId}`);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('PRODUCT_NOT_FOUND');
    });

    it('debería confirmar que el producto eliminado ya no es accesible', async () => {
      const created = await createProduct();
      await request(app).delete(`/api/products/${created._id}`);
      // Un GET posterior debe devolver 404
      const res = await request(app).get(`/api/products/${created._id}`);
      expect(res.status).to.equal(404);
    });
  });

});