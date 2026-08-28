// Cubre: GET all, GET by ID, POST, PUT, DELETE
//        Casos exitosos + casos de error (404, 409)
// Cada test parte de una BD limpia gracias al beforeEach de setup.js

import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

// ID con formato ObjectId válido pero que NO existe en la BD de test
const nonExistentId = new mongoose.Types.ObjectId().toString();

// Datos de prueba reutilizables
const userData = {
  name: 'Ana García',
  email: 'ana@example.com',
  password: 'secret123',
};

const anotherUserData = {
  name: 'Luis Pérez',
  email: 'luis@example.com',
  password: 'pass456',
};

// Helper: crea un usuario y devuelve el body de la respuesta
async function createUser(data = userData) {
  const res = await request(app).post('/api/users').send(data);
  return res.body;
}


describe('👤 Users — /api/users', () => {

  // GET /api/users 
  describe('GET /api/users', () => {
    it('debería devolver 200 y un arreglo vacío cuando no hay usuarios', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('debería devolver 200 con los usuarios existentes', async () => {
      await createUser();
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0].email).to.equal(userData.email);
    });

    it('debería filtrar solo usuarios activos con ?onlyActive=true', async () => {
      await createUser(userData);
      await createUser(anotherUserData);
      const res = await request(app).get('/api/users?onlyActive=true');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
      res.body.forEach((u) => expect(u.active).to.be.true);
    });
  });

  //POST /api/users
  describe('POST /api/users', () => {
    it('debería crear un usuario y devolver 201 con sus datos', async () => {
      const res = await request(app).post('/api/users').send(userData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal(userData.name);
      expect(res.body.email).to.equal(userData.email);
      expect(res.body.role).to.equal('user');   // valor por defecto
      expect(res.body.active).to.equal(true);    // valor por defecto
    });

    it('debería devolver 409 DUPLICATE_EMAIL si el email ya está registrado', async () => {
      await createUser(userData);                     // primer registro
      const res = await request(app).post('/api/users').send(userData); // duplicado
      expect(res.status).to.equal(409);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('DUPLICATE_EMAIL');
    });
  });

  // GET /api/users/:id 
  describe('GET /api/users/:id', () => {
    it('debería devolver 200 con los datos del usuario si existe', async () => {
      const created = await createUser();
      const res = await request(app).get(`/api/users/${created._id}`);
      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(created._id);
      expect(res.body.name).to.equal(userData.name);
      expect(res.body).to.not.have.property('password'); // la respuesta no expone contraseña
    });

    it('debería devolver 404 USER_NOT_FOUND si el usuario no existe', async () => {
      const res = await request(app).get(`/api/users/${nonExistentId}`);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('USER_NOT_FOUND');
    });
  });

  // PUT /api/users/:id
  describe('PUT /api/users/:id', () => {
    it('debería actualizar el nombre del usuario y devolver 200', async () => {
      const created = await createUser();
      const res = await request(app)
        .put(`/api/users/${created._id}`)
        .send({ name: 'Ana Actualizada' });
      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal('Ana Actualizada');
      expect(res.body._id).to.equal(created._id);
    });

    it('debería no exponer la contraseña en la respuesta del PUT', async () => {
      const created = await createUser();
      const res = await request(app)
        .put(`/api/users/${created._id}`)
        .send({ name: 'Sin password' });
      expect(res.status).to.equal(200);
      expect(res.body).to.not.have.property('password');
    });

    it('debería devolver 404 USER_NOT_FOUND si el usuario no existe', async () => {
      const res = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .send({ name: 'Nombre nuevo' });
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('USER_NOT_FOUND');
    });

    it('debería devolver 409 DUPLICATE_EMAIL al intentar usar un email ya registrado', async () => {
      // Creamos dos usuarios con emails distintos
      await createUser(userData);
      const u2 = await createUser(anotherUserData);
      // Intentamos cambiar el email del usuario 2 al del usuario 1
      const res = await request(app)
        .put(`/api/users/${u2._id}`)
        .send({ email: userData.email });
      expect(res.status).to.equal(409);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('DUPLICATE_EMAIL');
    });
  });

  // DELETE /api/users/:id
  describe('DELETE /api/users/:id', () => {
    it('debería eliminar el usuario y devolver 204 sin cuerpo', async () => {
      const created = await createUser();
      const res = await request(app).delete(`/api/users/${created._id}`);
      expect(res.status).to.equal(204);
    });

    it('debería devolver 404 USER_NOT_FOUND si el usuario no existe', async () => {
      const res = await request(app).delete(`/api/users/${nonExistentId}`);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.error.code).to.equal('USER_NOT_FOUND');
    });

    it('debería confirmar que el usuario eliminado ya no es accesible', async () => {
      const created = await createUser();
      await request(app).delete(`/api/users/${created._id}`);
      // Verificamos que ya no existe
      const res = await request(app).get(`/api/users/${created._id}`);
      expect(res.status).to.equal(404);
    });
  });

});