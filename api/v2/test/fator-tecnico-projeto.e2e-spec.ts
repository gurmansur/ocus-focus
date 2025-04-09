import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('FatorTecnicoProjetoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let fatorTecnicoProjetoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/signup')
      .send({
        nome: 'Fator Tecnico Test User',
        email: 'fator.tecnico.test@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'fator.tecnico.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Fator Tecnico',
        descricao: 'Projeto criado para testes e2e de Fator Tecnico',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000);

  describe('POST /fator-tecnico-projeto', () => {
    it('should create a new fator tecnico projeto', async () => {
      const createFatorTecnicoDto = {
        descricao: 'Complexidade de interface distribuída',
        sigla: 'T1',
        valor: 3,
        projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/fator-tecnico-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createFatorTecnicoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'descricao',
        createFatorTecnicoDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'sigla',
        createFatorTecnicoDto.sigla,
      );
      expect(response.body).toHaveProperty(
        'valor',
        createFatorTecnicoDto.valor,
      );
      expect(response.body).toHaveProperty('projetoId', projetoId);

      fatorTecnicoProjetoId = response.body.id;
    });

    it('should reject fator tecnico creation with invalid data', async () => {
      const invalidFatorDto = {
        // Missing required fields
        descricao: 'Fator sem sigla e valor',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-tecnico-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFatorDto)
        .expect(400);
    });

    it('should reject fator tecnico with invalid valor', async () => {
      const invalidValorDto = {
        descricao: 'Fator com valor inválido',
        sigla: 'T2',
        valor: 7, // Assumindo que o valor deve estar entre 0 e 5
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-tecnico-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValorDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createFatorTecnicoDto = {
        descricao: 'Fator Não Autorizado',
        sigla: 'T3',
        valor: 2,
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/fator-tecnico-projeto')
        .send(createFatorTecnicoDto)
        .expect(401);
    });
  });

  describe('GET /fatores-tecnicos-projeto', () => {
    it('should return all fatores tecnicos', async () => {
      const response = await request(app.getHttpServer())
        .get('/fatores-tecnicos-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdFator = response.body.find(
        (fator) => fator.id === fatorTecnicoProjetoId,
      );
      expect(createdFator).toBeDefined();
    });

    it('should return fatores tecnicos filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fatores-tecnicos-projeto?projetoId=${projetoId}`)
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
        .get('/fatores-tecnicos-projeto')
        .expect(401);
    });
  });

  describe('GET /fator-tecnico-projeto/:id', () => {
    it('should return fator tecnico by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/fator-tecnico-projeto/${fatorTecnicoProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorTecnicoProjetoId);
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('sigla');
      expect(response.body).toHaveProperty('valor');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent fator tecnico', async () => {
      await request(app.getHttpServer())
        .get('/fator-tecnico-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/fator-tecnico-projeto/${fatorTecnicoProjetoId}`)
        .expect(401);
    });
  });

  describe('PATCH /fator-tecnico-projeto/:id', () => {
    it('should update fator tecnico', async () => {
      const updateFatorDto = {
        descricao: 'Descrição atualizada do fator técnico',
        valor: 4,
      };

      const response = await request(app.getHttpServer())
        .patch(`/fator-tecnico-projeto/${fatorTecnicoProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateFatorDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', fatorTecnicoProjetoId);
      expect(response.body).toHaveProperty(
        'descricao',
        updateFatorDto.descricao,
      );
      expect(response.body).toHaveProperty('valor', updateFatorDto.valor);
    });

    it('should reject update with invalid valor', async () => {
      const invalidValorDto = {
        valor: 8, // Assumindo que o valor deve estar entre 0 e 5
      };

      await request(app.getHttpServer())
        .patch(`/fator-tecnico-projeto/${fatorTecnicoProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidValorDto)
        .expect(400);
    });

    it('should return 404 for non-existent fator tecnico', async () => {
      const updateFatorDto = {
        descricao: 'Fator Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/fator-tecnico-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateFatorDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateFatorDto = {
        descricao: 'Fator Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/fator-tecnico-projeto/${fatorTecnicoProjetoId}`)
        .send(updateFatorDto)
        .expect(401);
    });
  });

  describe('DELETE /fator-tecnico-projeto/:id', () => {
    it('should delete fator tecnico by id', async () => {
      // First create a fator tecnico that we'll delete
      const createTempFatorDto = {
        descricao: 'Fator Técnico Temporário para Deletar',
        sigla: 'TT',
        valor: 2,
        projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/fator-tecnico-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempFatorDto)
        .expect(201);

      const tempFatorId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/fator-tecnico-projeto/${tempFatorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify fator was deleted
      await request(app.getHttpServer())
        .get(`/fator-tecnico-projeto/${tempFatorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent fator tecnico', async () => {
      await request(app.getHttpServer())
        .delete('/fator-tecnico-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/fator-tecnico-projeto/1')
        .expect(401);
    });
  });
});
