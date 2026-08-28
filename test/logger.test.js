// Cubre: GET /api/logger-test
//        Verifica que el endpoint dispara logs en todos los niveles y responde con la estructura correcta.
//
// Nota: Este endpoint es una herramienta interna de validación del sistema de logging (no es funcionalidad de negocio).

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

// Niveles de log esperados según el controlador
const EXPECTED_LEVELS = ['debug', 'http', 'info', 'warning', 'error', 'fatal'];


describe('📋 Logger — /api/logger-test', () => {

  describe('GET /api/logger-test', () => {
    it('debería devolver 200 con success: true', async () => {
      const res = await request(app).get('/api/logger-test');
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });

    it('debería incluir una propiedad "message" descriptiva', async () => {
      const res = await request(app).get('/api/logger-test');
      expect(res.body).to.have.property('message').that.is.a('string').and.not.empty;
    });

    it('debería incluir todos los niveles de log en la propiedad "niveles"', async () => {
      const res = await request(app).get('/api/logger-test');
      expect(res.body).to.have.property('niveles').that.is.an('array');
      expect(res.body.niveles).to.have.lengthOf(EXPECTED_LEVELS.length);
      EXPECTED_LEVELS.forEach((level) => {
        expect(res.body.niveles).to.include(level, `Falta el nivel de log: ${level}`);
      });
    });

    it('debería incluir una propiedad "nota" con instrucciones para revisar logs', async () => {
      const res = await request(app).get('/api/logger-test');
      expect(res.body).to.have.property('nota').that.is.a('string').and.not.empty;
    });

    it('debería responder con Content-Type: application/json', async () => {
      const res = await request(app).get('/api/logger-test');
      expect(res.headers['content-type']).to.match(/application\/json/);
    });
  });

});