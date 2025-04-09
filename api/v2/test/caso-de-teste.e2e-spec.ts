import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('CasoDeTesteController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdCasoDeTesteId: number;
  let projetoId: number;
  let requisitoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Caso Teste User',
      email: 'caso.teste@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'caso.teste@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Caso de Teste',
        descricao: 'Projeto criado para testes e2e de Caso de Teste',
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
        nome: 'Requisito para Caso de Teste',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /caso-de-teste', () => {
    it('should create a new caso de teste', async () => {
      const createCasoDeTesteDto = {
        titulo: 'Caso de Teste E2E',
        objetivo: 'Testar a funcionalidade X',
        preCondicoes: 'Sistema inicializado',
        procedimentoDeExecucao: 'Passos para execução',
        resultadoEsperado: 'Resultado esperado após a execução',
        requisitoId: requisitoId,
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/caso-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCasoDeTesteDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'titulo',
        createCasoDeTesteDto.titulo,
      );
      expect(response.body).toHaveProperty(
        'objetivo',
        createCasoDeTesteDto.objetivo,
      );
      expect(response.body).toHaveProperty(
        'preCondicoes',
        createCasoDeTesteDto.preCondicoes,
      );
      expect(response.body).toHaveProperty(
        'procedimentoDeExecucao',
        createCasoDeTesteDto.procedimentoDeExecucao,
      );
      expect(response.body).toHaveProperty(
        'resultadoEsperado',
        createCasoDeTesteDto.resultadoEsperado,
      );
      expect(response.body).toHaveProperty(
        'requisitoId',
        createCasoDeTesteDto.requisitoId,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createCasoDeTesteDto.projetoId,
      );

      createdCasoDeTesteId = response.body.id;
    });

    it('should reject caso de teste creation with invalid data', async () => {
      const invalidCasoDeTesteDto = {
        // Missing required fields
        titulo: 'Caso de Teste Inválido',
      };

      await request(app.getHttpServer())
        .post('/caso-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCasoDeTesteDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createCasoDeTesteDto = {
        titulo: 'Caso de Teste Não Autorizado',
        objetivo: 'Testar a funcionalidade X',
        preCondicoes: 'Sistema inicializado',
        procedimentoDeExecucao: 'Passos para execução',
        resultadoEsperado: 'Resultado esperado após a execução',
        requisitoId: requisitoId,
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/caso-de-teste')
        .send(createCasoDeTesteDto)
        .expect(401);
    });
  });

  describe('GET /caso-de-teste', () => {
    it('should return all casos de teste', async () => {
      const response = await request(app.getHttpServer())
        .get('/caso-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdCasoDeTeste = response.body.find(
        (caso) => caso.id === createdCasoDeTesteId,
      );
      expect(createdCasoDeTeste).toBeDefined();
    });

    it('should return casos de teste filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-de-teste?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned casos de teste should belong to the specified project
      response.body.forEach((caso) => {
        expect(caso.projetoId).toBe(projetoId);
      });
    });

    it('should return casos de teste filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-de-teste?requisitoId=${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned casos de teste should belong to the specified requisito
      response.body.forEach((caso) => {
        expect(caso.requisitoId).toBe(requisitoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/caso-de-teste').expect(401);
    });
  });

  describe('GET /caso-de-teste/:id', () => {
    it('should return caso de teste by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/caso-de-teste/${createdCasoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCasoDeTesteId);
      expect(response.body).toHaveProperty('titulo');
      expect(response.body).toHaveProperty('objetivo');
      expect(response.body).toHaveProperty('preCondicoes');
      expect(response.body).toHaveProperty('procedimentoDeExecucao');
      expect(response.body).toHaveProperty('resultadoEsperado');
      expect(response.body).toHaveProperty('requisitoId', requisitoId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent caso de teste', async () => {
      await request(app.getHttpServer())
        .get('/caso-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/caso-de-teste/${createdCasoDeTesteId}`)
        .expect(401);
    });
  });

  describe('PATCH /caso-de-teste/:id', () => {
    it('should update caso de teste by id', async () => {
      const updateCasoDeTesteDto = {
        titulo: 'Caso de Teste Atualizado',
        objetivo: 'Objetivo atualizado para teste e2e',
        procedimentoDeExecucao: 'Procedimento de execução atualizado',
      };

      const response = await request(app.getHttpServer())
        .patch(`/caso-de-teste/${createdCasoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCasoDeTesteDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdCasoDeTesteId);
      expect(response.body).toHaveProperty(
        'titulo',
        updateCasoDeTesteDto.titulo,
      );
      expect(response.body).toHaveProperty(
        'objetivo',
        updateCasoDeTesteDto.objetivo,
      );
      expect(response.body).toHaveProperty(
        'procedimentoDeExecucao',
        updateCasoDeTesteDto.procedimentoDeExecucao,
      );
      expect(response.body).toHaveProperty('requisitoId', requisitoId);
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent caso de teste', async () => {
      const updateCasoDeTesteDto = {
        titulo: 'Caso de Teste Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/caso-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCasoDeTesteDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateCasoDeTesteDto = {
        titulo: 'Caso de Teste Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/caso-de-teste/${createdCasoDeTesteId}`)
        .send(updateCasoDeTesteDto)
        .expect(401);
    });
  });

  describe('DELETE /caso-de-teste/:id', () => {
    it('should delete caso de teste by id', async () => {
      await request(app.getHttpServer())
        .delete(`/caso-de-teste/${createdCasoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify caso de teste was deleted
      await request(app.getHttpServer())
        .get(`/caso-de-teste/${createdCasoDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent caso de teste', async () => {
      await request(app.getHttpServer())
        .delete('/caso-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/caso-de-teste/1').expect(401);
    });
  });
});
