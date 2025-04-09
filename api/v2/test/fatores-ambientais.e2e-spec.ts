import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('FatoresAmbientaisController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'FatoresAmbientais Test User',
      email: 'fatores.ambientais@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'fatores.ambientais@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('GET /fatores-ambientais', () => {
    it('should return all fatores ambientais', async () => {
      const response = await request(app.getHttpServer())
        .get('/fatores-ambientais')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Fatores ambientais are pre-seeded, so we should have at least a few
      expect(response.body.length).toBeGreaterThan(0);

      // Check that each fatores ambientais has the expected structure
      response.body.forEach((fatorAmbiental) => {
        expect(fatorAmbiental).toHaveProperty('id');
        expect(fatorAmbiental).toHaveProperty('nome');
        expect(fatorAmbiental).toHaveProperty('descricao');
        expect(fatorAmbiental).toHaveProperty('peso');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/fatores-ambientais').expect(401);
    });
  });

  describe('GET /fatores-ambientais/:id', () => {
    it('should return a specific fator ambiental by id', async () => {
      // First get all fatores ambientais to pick one
      const allResponse = await request(app.getHttpServer())
        .get('/fatores-ambientais')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const fatorAmbientalId = allResponse.body[0].id;

      // Then get the specific fator ambiental
      const response = await request(app.getHttpServer())
        .get(`/fatores-ambientais/${fatorAmbientalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorAmbientalId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('peso');
    });

    it('should return 404 for non-existent fator ambiental', async () => {
      await request(app.getHttpServer())
        .get('/fatores-ambientais/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/fatores-ambientais/1')
        .expect(401);
    });
  });

  // Note: Since fatores ambientais are typically pre-seeded and not modified by users,
  // we may not have POST, PATCH, or DELETE endpoints to test.
  // If these endpoints are available, additional tests would be added here.
});
