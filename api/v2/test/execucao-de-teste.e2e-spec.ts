import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ExecucaoDeTesteController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdExecucaoDeTesteId: number;
  let projetoId: number;
  let casoDeTesteId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'ExecucaoTeste User',
      email: 'execucao.teste@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'execucao.teste@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Execução',
        descricao: 'Projeto criado para testes e2e de Execução de Teste',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a requisito for the caso de teste
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Execução de Teste',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    const requisitoId = requisitoResponse.body.id;

    // Create a caso de teste for the execucao de teste
    const casoDeTesteResponse = await request(app.getHttpServer())
      .post('/caso-de-teste')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        titulo: 'Caso de Teste para Execução',
        objetivo: 'Testar a funcionalidade X',
        preCondicoes: 'Sistema inicializado',
        procedimentoDeExecucao: 'Passos para execução',
        resultadoEsperado: 'Resultado esperado após a execução',
        requisitoId: requisitoId,
        projetoId: projetoId,
      });

    casoDeTesteId = casoDeTesteResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /execucao-de-teste', () => {
    it('should create a new execucao de teste', async () => {
      const createExecucaoDeTesteDto = {
        dataExecucao: new Date().toISOString(),
        status: 'PASSOU',
        observacoes: 'Execução de teste realizada com sucesso',
        casoDeTesteId: casoDeTesteId,
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/execucao-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createExecucaoDeTesteDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('dataExecucao');
      expect(response.body).toHaveProperty(
        'status',
        createExecucaoDeTesteDto.status,
      );
      expect(response.body).toHaveProperty(
        'observacoes',
        createExecucaoDeTesteDto.observacoes,
      );
      expect(response.body).toHaveProperty(
        'casoDeTesteId',
        createExecucaoDeTesteDto.casoDeTesteId,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createExecucaoDeTesteDto.projetoId,
      );

      createdExecucaoDeTesteId = response.body.id;
    });

    it('should reject execucao de teste creation with invalid data', async () => {
      const invalidExecucaoDeTesteDto = {
        // Missing required fields
        observacoes: 'Execução inválida',
      };

      await request(app.getHttpServer())
        .post('/execucao-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExecucaoDeTesteDto)
        .expect(400);
    });

    it('should reject execucao de teste with invalid status', async () => {
      const invalidStatusDto = {
        dataExecucao: new Date().toISOString(),
        status: 'STATUS_INVALIDO',
        casoDeTesteId: casoDeTesteId,
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/execucao-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createExecucaoDeTesteDto = {
        dataExecucao: new Date().toISOString(),
        status: 'PASSOU',
        observacoes: 'Execução de teste não autorizada',
        casoDeTesteId: casoDeTesteId,
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/execucao-de-teste')
        .send(createExecucaoDeTesteDto)
        .expect(401);
    });
  });

  describe('GET /execucao-de-teste', () => {
    it('should return all execucoes de teste', async () => {
      const response = await request(app.getHttpServer())
        .get('/execucao-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdExecucaoDeTeste = response.body.find(
        (execucao) => execucao.id === createdExecucaoDeTesteId,
      );
      expect(createdExecucaoDeTeste).toBeDefined();
    });

    it('should return execucoes de teste filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/execucao-de-teste?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned execucoes de teste should belong to the specified project
      response.body.forEach((execucao) => {
        expect(execucao.projetoId).toBe(projetoId);
      });
    });

    it('should return execucoes de teste filtered by caso de teste', async () => {
      const response = await request(app.getHttpServer())
        .get(`/execucao-de-teste?casoDeTesteId=${casoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned execucoes de teste should belong to the specified caso de teste
      response.body.forEach((execucao) => {
        expect(execucao.casoDeTesteId).toBe(casoDeTesteId);
      });
    });

    it('should return execucoes de teste filtered by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/execucao-de-teste?status=PASSOU')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned execucoes de teste should have the specified status
      response.body.forEach((execucao) => {
        expect(execucao.status).toBe('PASSOU');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/execucao-de-teste').expect(401);
    });
  });

  describe('GET /execucao-de-teste/:id', () => {
    it('should return execucao de teste by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdExecucaoDeTesteId);
      expect(response.body).toHaveProperty('dataExecucao');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('observacoes');
      expect(response.body).toHaveProperty('casoDeTesteId', casoDeTesteId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent execucao de teste', async () => {
      await request(app.getHttpServer())
        .get('/execucao-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .expect(401);
    });
  });

  describe('PATCH /execucao-de-teste/:id', () => {
    it('should update execucao de teste by id', async () => {
      const updateExecucaoDeTesteDto = {
        status: 'FALHOU',
        observacoes: 'Execução de teste atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateExecucaoDeTesteDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdExecucaoDeTesteId);
      expect(response.body).toHaveProperty(
        'status',
        updateExecucaoDeTesteDto.status,
      );
      expect(response.body).toHaveProperty(
        'observacoes',
        updateExecucaoDeTesteDto.observacoes,
      );
      expect(response.body).toHaveProperty('casoDeTesteId', casoDeTesteId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should reject invalid status update', async () => {
      const invalidStatusUpdateDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent execucao de teste', async () => {
      const updateExecucaoDeTesteDto = {
        status: 'PASSOU',
      };

      await request(app.getHttpServer())
        .patch('/execucao-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateExecucaoDeTesteDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateExecucaoDeTesteDto = {
        status: 'SKIPPED',
      };

      await request(app.getHttpServer())
        .patch(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .send(updateExecucaoDeTesteDto)
        .expect(401);
    });
  });

  describe('DELETE /execucao-de-teste/:id', () => {
    it('should delete execucao de teste by id', async () => {
      await request(app.getHttpServer())
        .delete(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify execucao de teste was deleted
      await request(app.getHttpServer())
        .get(`/execucao-de-teste/${createdExecucaoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent execucao de teste', async () => {
      await request(app.getHttpServer())
        .delete('/execucao-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/execucao-de-teste/1')
        .expect(401);
    });
  });
});
