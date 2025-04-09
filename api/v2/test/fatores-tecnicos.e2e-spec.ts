import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('FatoresTecnicosController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'FatoresTecnicos Test User',
      email: 'fatores.tecnicos@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'fatores.tecnicos@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('GET /fatores-tecnicos', () => {
    it('should return all fatores tecnicos', async () => {
      const response = await request(app.getHttpServer())
        .get('/fatores-tecnicos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // Fatores tecnicos are pre-seeded, so we should have at least a few
      expect(response.body.length).toBeGreaterThan(0);

      // Check that each fatores tecnicos has the expected structure
      response.body.forEach(fatorTecnico => {
        expect(fatorTecnico).toHaveProperty('id');
        expect(fatorTecnico).toHaveProperty('nome');
        expect(fatorTecnico).toHaveProperty('descricao');
        expect(fatorTecnico).toHaveProperty('peso');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/fatores-tecnicos')
        .expect(401);
    });
  });

  describe('GET /fatores-tecnicos/:id', () => {
    it('should return a specific fator tecnico by id', async () => {
      // First get all fatores tecnicos to pick one
      const allResponse = await request(app.getHttpServer())
        .get('/fatores-tecnicos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const fatorTecnicoId = allResponse.body[0].id;

      // Then get the specific fator tecnico
      const response = await request(app.getHttpServer())
        .get(`/fatores-tecnicos/${fatorTecnicoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorTecnicoId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('peso');
    });

    it('should return 404 for non-existent fator tecnico', async () => {
      await request(app.getHttpServer())
        .get('/fatores-tecnicos/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/fatores-tecnicos/1')
        .expect(401);
    });
  });

  // Note: Since fatores tecnicos are typically pre-seeded and not modified by users,
  // we may not have POST, PATCH, or DELETE endpoints to test.
  // If these endpoints are available, additional tests would be added here.
}); 