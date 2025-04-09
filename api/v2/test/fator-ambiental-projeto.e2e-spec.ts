import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('FatorAmbientalProjetoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let fatorAmbientalProjetoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer()).post('/signup').send({
      nome: 'Fator Ambiental Test User',
      email: 'fator.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Desenvolvedor',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'fator.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Fator Ambiental',
        descricao: 'Projeto criado para testes e2e de Fator Ambiental',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /fator-ambiental-projeto', () => {
    it('should create a new fator ambiental projeto', async () => {
      const createFatorAmbientalDto = {
        descricao: 'Experiência dos desenvolvedores com a tecnologia',
        sigla: 'E1',
        valor: 3,
        projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/fator-ambiental-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createFatorAmbientalDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('descricao', createFatorAmbientalDto.descricao);
      expect(response.body).toHaveProperty('sigla', createFatorAmbientalDto.sigla);
      expect(response.body).toHaveProperty('valor', createFatorAmbientalDto.valor);
      expect(response.body).toHaveProperty('projetoId', projetoId);

      fatorAmbientalProjetoId = response.body.id;
    });

    it('should reject fator ambiental creation with invalid data', async () => {
      const invalidFatorDto = {
        // Missing required fields
        descricao: 'Fator sem sigla e valor',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-ambiental-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFatorDto)
        .expect(400);
    });

    it('should reject fator ambiental with invalid valor', async () => {
      const invalidValorDto = {
        descricao: 'Fator com valor inválido',
        sigla: 'E2',
        valor: 7, // Assumindo que o valor deve estar entre 0 e 5
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-ambiental-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValorDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createFatorAmbientalDto = {
        descricao: 'Fator Não Autorizado',
        sigla: 'E3',
        valor: 2,
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-ambiental-projeto')
        .send(createFatorAmbientalDto)
        .expect(401);
    });
  });

  describe('GET /fatores-ambientais-projeto', () => {
    it('should return all fatores ambientais', async () => {
      const response = await request(app.getHttpServer())
        .get('/fatores-ambientais-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdFator = response.body.find(
        (fator) => fator.id === fatorAmbientalProjetoId
      );
      expect(createdFator).toBeDefined();
    });

    it('should return fatores ambientais filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fatores-ambientais-projeto?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned fatores should belong to the specified projeto
      response.body.forEach((fator) => {
        expect(fator.projetoId).toBe(projetoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/fatores-ambientais-projeto')
        .expect(401);
    });
  });

  describe('GET /fator-ambiental-projeto/:id', () => {
    it('should return fator ambiental by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fator-ambiental-projeto/${fatorAmbientalProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorAmbientalProjetoId);
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('sigla');
      expect(response.body).toHaveProperty('valor');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent fator ambiental', async () => {
      await request(app.getHttpServer())
        .get('/fator-ambiental-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/fator-ambiental-projeto/${fatorAmbientalProjetoId}`)
        .expect(401);
    });
  });

  describe('PATCH /fator-ambiental-projeto/:id', () => {
    it('should update fator ambiental', async () => {
      const updateFatorDto = {
        descricao: 'Descrição atualizada do fator ambiental',
        valor: 4,
      };

      const response = await request(app.getHttpServer())
        .patch(`/fator-ambiental-projeto/${fatorAmbientalProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateFatorDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorAmbientalProjetoId);
      expect(response.body).toHaveProperty('descricao', updateFatorDto.descricao);
      expect(response.body).toHaveProperty('valor', updateFatorDto.valor);
    });

    it('should reject update with invalid valor', async () => {
      const invalidValorDto = {
        valor: 8, // Assumindo que o valor deve estar entre 0 e 5
      };

      await request(app.getHttpServer())
        .patch(`/fator-ambiental-projeto/${fatorAmbientalProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValorDto)
        .expect(400);
    });

    it('should return 404 for non-existent fator ambiental', async () => {
      const updateFatorDto = {
        descricao: 'Fator Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/fator-ambiental-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateFatorDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateFatorDto = {
        descricao: 'Fator Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/fator-ambiental-projeto/${fatorAmbientalProjetoId}`)
        .send(updateFatorDto)
        .expect(401);
    });
  });

  describe('DELETE /fator-ambiental-projeto/:id', () => {
    it('should delete fator ambiental by id', async () => {
      // First create a fator ambiental that we'll delete
      const createTempFatorDto = {
        descricao: 'Fator Ambiental Temporário para Deletar',
        sigla: 'ET',
        valor: 2,
        projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/fator-ambiental-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempFatorDto)
        .expect(201);

      const tempFatorId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/fator-ambiental-projeto/${tempFatorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify fator was deleted
      await request(app.getHttpServer())
        .get(`/fator-ambiental-projeto/${tempFatorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent fator ambiental', async () => {
      await request(app.getHttpServer())
        .delete('/fator-ambiental-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/fator-ambiental-projeto/1')
        .expect(401);
    });
  });
});
