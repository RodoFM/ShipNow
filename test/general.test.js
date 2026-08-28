// Cubre:
//   - Ruta raíz GET /  → responde con info de la API
//   - Documentación GET /api/docs.json → JSON válido con spec OpenAPI
//   - Rutas inexistentes → 404 ROUTE_NOT_FOUND (middleware notFoundHandler)

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';


describe('🌐 General — Raíz, Documentación y 404', () => {

  // Ruta raíz 
  describe('GET /', () => {
    it('debería devolver 200 con mensaje y versión de la API', async () => {
      const res = await request(app).get('/');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').that.is.a('string');
      expect(res.body).to.have.property('version').that.is.a('string');
    });

    it('el mensaje debería mencionar el modo de ejecución (test)', async () => {
      const res = await request(app).get('/');
      expect(res.status).to.equal(200);
      // En NODE_ENV=test el mensaje incluye "test"
      expect(res.body.message.toLowerCase()).to.include('test');
    });
  });

  // Documentación OpenAPI (JSON crudo)
  describe('GET /api/docs.json', () => {
    it('debería devolver 200 con el spec OpenAPI en formato JSON', async () => {
      const res = await request(app).get('/api/docs.json');
      expect(res.status).to.equal(200);
      expect(res.headers['content-type']).to.match(/application\/json/);
    });

    it('debería incluir la versión openapi correcta', async () => {
      const res = await request(app).get('/api/docs.json');
      expect(res.body).to.have.property('openapi').that.equals('3.0.3');
    });

    it('debería incluir las secciones info y paths del spec', async () => {
      const res = await request(app).get('/api/docs.json');
      expect(res.body).to.have.property('info');
      expect(res.body).to.have.property('paths');
      expect(res.body.info).to.have.property('title').that.includes('ShipNow');
    });
  });

  // Rutas inexistentes (notFoundHandler) 
  describe('Rutas inexistentes → 404 ROUTE_NOT_FOUND', () => {
    it('debería devolver 404 con código ROUTE_NOT_FOUND para rutas no definidas', async () => {
      const res = await request(app).get('/api/ruta-que-no-existe');
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error).to.have.property('code').that.equals('ROUTE_NOT_FOUND');
    });

    it('debería devolver 404 para métodos no soportados en rutas existentes', async () => {
      // PATCH no está definido en ningún router
      const res = await request(app).patch('/api/users');
      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal('ROUTE_NOT_FOUND');
    });

    it('debería incluir el método y la ruta en el mensaje de error', async () => {
      const res = await request(app).get('/api/endpoint-inventado');
      expect(res.status).to.equal(404);
      expect(res.body.error.message).to.include('/api/endpoint-inventado');
    });

    it('debería tener formato de error estándar: { success, error: { code, message } }', async () => {
      const res = await request(app).get('/ruta/inexistente');
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('success').that.equals(false);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.have.property('code');
      expect(res.body.error).to.have.property('message');
    });

    it('la respuesta 404 no debería incluir "stack" (no estamos en modo development)', async () => {
      const res = await request(app).get('/ruta/inexistente');
      expect(res.body.error).to.not.have.property('stack');
    });
  });

});