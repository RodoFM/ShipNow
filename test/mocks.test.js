// Cubre: generación de datos sin persistir (GET users/orders/deliveries) y carga masiva en BD (POST seed)
//        Validación de cantidad: rango 1-100, NaN
//
// Nota: Los endpoints GET de mocks generan datos con Faker en memoria (no persisten en la BD), por lo que no dependen del estado previo.
//       El POST seed sí persiste; el beforeEach de setup.js limpia antes.

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';


describe('🎲 Mocks — /api/mocks', () => {

  // GET /api/mocks/users
  describe('GET /api/mocks/users', () => {
    it('debería devolver 200 con 5 usuarios por defecto (sin qty)', async () => {
      const res = await request(app).get('/api/mocks/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(5); // default: qty=5
    });

    it('debería devolver 200 con N usuarios cuando se pasa ?qty=N', async () => {
      const res = await request(app).get('/api/mocks/users?qty=3');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(3);
    });

    it('debería devolver 200 con 10 usuarios cuando qty=10', async () => {
      const res = await request(app).get('/api/mocks/users?qty=10');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(10);
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty=0', async () => {
      const res = await request(app).get('/api/mocks/users?qty=0');
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty > 100', async () => {
      const res = await request(app).get('/api/mocks/users?qty=101');
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty no es un número', async () => {
      const res = await request(app).get('/api/mocks/users?qty=abc');
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });

    it('los datos generados no deben persistir en la BD', async () => {
      // Generamos usuarios pero la colección debe seguir vacía
      await request(app).get('/api/mocks/users?qty=5');
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });

  //GET /api/mocks/orders 
  describe('GET /api/mocks/orders', () => {
    it('debería devolver 200 con 3 pedidos por defecto (sin qty)', async () => {
      const res = await request(app).get('/api/mocks/orders');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(3); // default: qty=3
    });

    it('debería devolver 200 con N pedidos cuando se pasa ?qty=N', async () => {
      const res = await request(app).get('/api/mocks/orders?qty=5');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(5);
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty=0', async () => {
      const res = await request(app).get('/api/mocks/orders?qty=0');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty > 100', async () => {
      const res = await request(app).get('/api/mocks/orders?qty=200');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });
  });

  // GET /api/mocks/deliveries 
  describe('GET /api/mocks/deliveries', () => {
    it('debería devolver 200 con 3 entregas por defecto (sin qty)', async () => {
      const res = await request(app).get('/api/mocks/deliveries');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(3); // default: qty=3
    });

    it('debería devolver 200 con N entregas cuando se pasa ?qty=N', async () => {
      const res = await request(app).get('/api/mocks/deliveries?qty=7');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(7);
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty=0', async () => {
      const res = await request(app).get('/api/mocks/deliveries?qty=0');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });
  });

  // POST /api/mocks/seed 
  describe('POST /api/mocks/seed', () => {
    it('debería insertar datos en la BD y devolver 201 con resumen', async () => {
      const res = await request(app).post('/api/mocks/seed?qty=5');
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('insertados');
      // El seed genera usuarios + couriers, pedidos y entregas
      expect(res.body.insertados).to.have.property('usuarios').that.is.a('number').above(0);
      expect(res.body.insertados).to.have.property('pedidos').that.is.a('number').above(0);
      expect(res.body.insertados).to.have.property('entregas').that.is.a('number').above(0);
    });

    it('debería persistir los usuarios en la BD tras el seed', async () => {
      await request(app).post('/api/mocks/seed?qty=3');
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      // El seed inserta 3 users + Math.ceil(3/3)=1 courier = 4 usuarios totales
      expect(res.body).to.be.an('array').that.is.not.empty;
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty=0', async () => {
      const res = await request(app).post('/api/mocks/seed?qty=0');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });

    it('debería devolver 400 INVALID_MOCK_QUANTITY si qty > 100', async () => {
      const res = await request(app).post('/api/mocks/seed?qty=150');
      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_MOCK_QUANTITY');
    });
  });

});