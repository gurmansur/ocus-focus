import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ColaboradorProjetoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdColaboradorProjetoId: number;
  let projetoId: number;
  let colaboradorId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'ColabProjeto Test Admin',
      email: 'colabprojeto.admin@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Gerente de Projeto',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'colabprojeto.admin@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Colaborador Projeto',
        descricao: 'Projeto criado para testes e2e de Colaborador Projeto',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a test colaborador
    const colaboradorResponse = await request(app.getHttpServer())
      .post('/colaborador')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Colaborador para Projeto',
        email: 'colaborador.projeto@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      });

    colaboradorId = colaboradorResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /colaborador-projeto', () => {
    it('should create a new colaborador-projeto', async () => {
      const createColaboradorProjetoDto = {
        colaboradorId: colaboradorId,
        projetoId: projetoId,
        funcao: 'DESENVOLVEDOR',
      };

      const response = await request(app.getHttpServer())
        .post('/colaborador-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createColaboradorProjetoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'colaboradorId',
        createColaboradorProjetoDto.colaboradorId,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createColaboradorProjetoDto.projetoId,
      );
      expect(response.body).toHaveProperty(
        'funcao',
        createColaboradorProjetoDto.funcao,
      );

      createdColaboradorProjetoId = response.body.id;
    });

    it('should reject colaborador-projeto creation with invalid data', async () => {
      const invalidColaboradorProjetoDto = {
        // Missing required fields
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/colaborador-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidColaboradorProjetoDto)
        .expect(400);
    });

    it('should reject duplicate colaborador-projeto association', async () => {
      const duplicateColaboradorProjetoDto = {
        colaboradorId: colaboradorId,
        projetoId: projetoId,
        funcao: 'ANALISTA',
      };

      await request(app.getHttpServer())
        .post('/colaborador-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateColaboradorProjetoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createColaboradorProjetoDto = {
        colaboradorId: colaboradorId,
        projetoId: projetoId,
        funcao: 'DESENVOLVEDOR',
      };

      await request(app.getHttpServer())
        .post('/colaborador-projeto')
        .send(createColaboradorProjetoDto)
        .expect(401);
    });
  });

  describe('GET /colaborador-projeto', () => {
    it('should return all colaborador-projeto associations', async () => {
      const response = await request(app.getHttpServer())
        .get('/colaborador-projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdColaboradorProjeto = response.body.find(
        (cp) => cp.id === createdColaboradorProjetoId,
      );
      expect(createdColaboradorProjeto).toBeDefined();
    });

    it('should return colaborador-projeto filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/colaborador-projeto?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned colaborador-projeto should belong to the specified project
      response.body.forEach((cp) => {
        expect(cp.projetoId).toBe(projetoId);
      });
    });

    it('should return colaborador-projeto filtered by colaborador', async () => {
      const response = await request(app.getHttpServer())
        .get(`/colaborador-projeto?colaboradorId=${colaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned colaborador-projeto should belong to the specified colaborador
      response.body.forEach((cp) => {
        expect(cp.colaboradorId).toBe(colaboradorId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/colaborador-projeto')
        .expect(401);
    });
  });

  describe('GET /colaborador-projeto/:id', () => {
    it('should return colaborador-projeto by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdColaboradorProjetoId);
      expect(response.body).toHaveProperty('colaboradorId', colaboradorId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('funcao');
    });

    it('should return 404 for non-existent colaborador-projeto', async () => {
      await request(app.getHttpServer())
        .get('/colaborador-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .expect(401);
    });
  });

  describe('PATCH /colaborador-projeto/:id', () => {
    it('should update colaborador-projeto by id', async () => {
      const updateColaboradorProjetoDto = {
        funcao: 'ANALISTA',
      };

      const response = await request(app.getHttpServer())
        .patch(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateColaboradorProjetoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdColaboradorProjetoId);
      expect(response.body).toHaveProperty(
        'funcao',
        updateColaboradorProjetoDto.funcao,
      );
      expect(response.body).toHaveProperty('colaboradorId', colaboradorId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent colaborador-projeto', async () => {
      const updateColaboradorProjetoDto = {
        funcao: 'SCRUM_MASTER',
      };

      await request(app.getHttpServer())
        .patch('/colaborador-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateColaboradorProjetoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateColaboradorProjetoDto = {
        funcao: 'PRODUCT_OWNER',
      };

      await request(app.getHttpServer())
        .patch(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .send(updateColaboradorProjetoDto)
        .expect(401);
    });
  });

  describe('DELETE /colaborador-projeto/:id', () => {
    it('should delete colaborador-projeto by id', async () => {
      await request(app.getHttpServer())
        .delete(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify colaborador-projeto was deleted
      await request(app.getHttpServer())
        .get(`/colaborador-projeto/${createdColaboradorProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent colaborador-projeto', async () => {
      await request(app.getHttpServer())
        .delete('/colaborador-projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/colaborador-projeto/1')
        .expect(401);
    });
  });
});
