// Cubre:
//   - POST /api/uploads/users/:id/documents
//       ✔ carga correcta (201 + metadatos en respuesta)
//       ✔ falta el archivo → 400 FILE_REQUIRED
//       ✔ tipo de documento inválido → 400 INVALID_DOCUMENT_TYPE
//       ✔ usuario inexistente → 404 USER_NOT_FOUND
//       ✔ tipo MIME no permitido → 400 INVALID_FILE_TYPE
//       ✔ imagen PNG como documento → 201
//   - POST /api/uploads/orders/:id/receipts
//       ✔ carga correcta (201 + metadatos en respuesta)
//       ✔ falta el archivo → 400 FILE_REQUIRED
//       ✔ pedido inexistente → 404 ORDER_NOT_FOUND
//   - POST /api/uploads/deliveries/:id/receipts
//       ✔ carga correcta (201 + metadatos en respuesta)
//       ✔ entrega inexistente → 404 DELIVERY_NOT_FOUND
//
// Usa buffers en memoria como archivos.
// El beforeEach de setup.js limpia la BD antes de cada test.

import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

const nonExistentId = new mongoose.Types.ObjectId().toString();

const userData = {
  name: 'Carlos Test',
  email: 'carlos@test.com',
  password: 'pass123',
};

// Helper: crea un usuario y devuelve su body
async function createUser(data = userData) {
  const res = await request(app).post('/api/users').send(data);
  return res.body;
}

// Helper: crea un pedido vía seed y devuelve el primer pedido de la BD
async function seedAndGetOrder() {
  await request(app).post('/api/mocks/seed?qty=1');
  const Order = (await import('../src/models/order.model.js')).default;
  const order = await Order.findOne();
  return order;
}

// Helper: crea una entrega vía seed y devuelve la primera entrega de la BD
async function seedAndGetDelivery() {
  await request(app).post('/api/mocks/seed?qty=1');
  const Delivery = (await import('../src/models/delivery.model.js')).default;
  const delivery = await Delivery.findOne();
  return delivery;
}

describe(' Uploads — /api/uploads', () => {

  describe('POST /api/uploads/users/:id/documents', () => {

    it('debería subir un documento y devolver 201 con los metadatos', async () => {
      const user = await createUser();

      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field('documentType', 'dni')
        .attach('document', Buffer.from('contenido de prueba PDF'), {
          filename: 'mi_dni.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body).to.have.property('document');
      expect(res.body.document.documentType).to.equal('dni');
      expect(res.body.document.originalName).to.equal('mi_dni.pdf');
      expect(res.body.document.mimetype).to.equal('application/pdf');
      expect(res.body.document).to.have.property('generatedName');
      expect(res.body.document).to.have.property('path');
      expect(res.body.document).to.have.property('size');
      expect(res.body.userId).to.equal(user._id);
    });

    it('debería devolver 400 FILE_REQUIRED si no se envía el archivo', async () => {
      const user = await createUser();

      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field('documentType', 'dni');
        // sin .attach() → no hay archivo

      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('FILE_REQUIRED');
    });

    it('debería devolver 400 INVALID_DOCUMENT_TYPE si el tipo no es válido', async () => {
      const user = await createUser();

      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field('documentType', 'pasaporte')  // ← no existe en USER_DOCUMENT_TYPES
        .attach('document', Buffer.from('test'), {
          filename: 'doc.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_DOCUMENT_TYPE');
    });

    it('debería devolver 404 USER_NOT_FOUND si el usuario no existe', async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${nonExistentId}/documents`)
        .field('documentType', 'dni')
        .attach('document', Buffer.from('test'), {
          filename: 'doc.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).to.equal(404);
      expect(res.body.error.code).to.equal('USER_NOT_FOUND');
    });

    it('debería devolver 400 INVALID_FILE_TYPE si el tipo MIME no está permitido', async () => {
      const user = await createUser();

      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field('documentType', 'dni')
        .attach('document', Buffer.from('<script>hack</script>'), {
          filename: 'malicioso.html',
          contentType: 'text/html',  // ← tipo no permitido
        });

      expect(res.status).to.equal(400);
      expect(res.body.error.code).to.equal('INVALID_FILE_TYPE');
    });

    it('debería aceptar imagen PNG como documento', async () => {
      const user = await createUser();

      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field('documentType', 'licencia')
        .attach('document', Buffer.from('fake png content'), {
          filename: 'licencia.png',
          contentType: 'image/png',
        });

      expect(res.status).to.equal(201);
      expect(res.body.document.mimetype).to.equal('image/png');
      expect(res.body.document.documentType).to.equal('licencia');
    });
  });

  // ... (tests de orders y deliveries con la misma estructura)
});