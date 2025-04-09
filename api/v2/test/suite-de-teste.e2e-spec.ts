import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('SuiteDeTesteController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let casoDeTesteId: number;
  let createdSuiteDeTesteId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'SuiteDeTeste Test User',
      email: 'suite.teste@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Testes',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'suite.teste@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Suite de Teste',
        descricao: 'Projeto criado para testes e2e de Suite de Teste',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a requisito
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Suite de Teste',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;

    // Create a caso de teste
    const casoDeTesteResponse = await request(app.getHttpServer())
      .post('/caso-de-teste')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        titulo: 'Caso de Teste para Suite de Teste',
        descricao: 'Descrição do caso de teste para teste e2e',
        preCondicoes: 'Pré-condições do teste',
        passos: 'Passos do teste',
        resultadoEsperado: 'Resultado esperado do teste',
        projetoId: projetoId,
        requisitoId: requisitoId,
      });

    casoDeTesteId = casoDeTesteResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /suite-de-teste', () => {
    it('should create a new suite de teste', async () => {
      const createSuiteDeTesteDto = {
        nome: 'Suite de Teste de Exemplo',
        descricao: 'Descrição da suite de teste para teste e2e',
        projetoId: projetoId,
        casoDeTesteIds: [casoDeTesteId],
      };

      const response = await request(app.getHttpServer())
        .post('/suite-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSuiteDeTesteDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createSuiteDeTesteDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createSuiteDeTesteDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createSuiteDeTesteDto.projetoId,
      );
      expect(response.body).toHaveProperty('casosDeTeste');
      expect(Array.isArray(response.body.casosDeTeste)).toBe(true);
      expect(response.body.casosDeTeste.length).toBe(1);
      expect(response.body.casosDeTeste[0].id).toBe(casoDeTesteId);

      createdSuiteDeTesteId = response.body.id;
    });

    it('should reject suite de teste creation with invalid data', async () => {
      const invalidSuiteDeTesteDto = {
        // Missing required fields
        descricao: 'Descrição sem nome',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/suite-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSuiteDeTesteDto)
        .expect(400);
    });

    it('should reject suite de teste with non-existent caso de teste', async () => {
      const invalidCasoDeTesteDto = {
        nome: 'Suite com Caso de Teste Inválido',
        descricao: 'Descrição da suite com caso de teste inválido',
        projetoId: projetoId,
        casoDeTesteIds: [9999], // Non-existent ID
      };

      await request(app.getHttpServer())
        .post('/suite-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCasoDeTesteDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createSuiteDeTesteDto = {
        nome: 'Suite de Teste Não Autorizada',
        descricao: 'Descrição da suite de teste não autorizada',
        projetoId: projetoId,
        casoDeTesteIds: [casoDeTesteId],
      };

      await request(app.getHttpServer())
        .post('/suite-de-teste')
        .send(createSuiteDeTesteDto)
        .expect(401);
    });
  });

  describe('GET /suites-de-teste', () => {
    it('should return all suites de teste', async () => {
      const response = await request(app.getHttpServer())
        .get('/suites-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdSuiteDeTeste = response.body.find(
        (suite) => suite.id === createdSuiteDeTesteId,
      );
      expect(createdSuiteDeTeste).toBeDefined();
    });

    it('should return suites de teste filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/suites-de-teste?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned suites should belong to the specified projeto
      response.body.forEach((suite) => {
        expect(suite.projetoId).toBe(projetoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/suites-de-teste').expect(401);
    });
  });

  describe('GET /suite-de-teste/:id', () => {
    it('should return suite de teste by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSuiteDeTesteId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('casosDeTeste');
      expect(Array.isArray(response.body.casosDeTeste)).toBe(true);
    });

    it('should return 404 for non-existent suite de teste', async () => {
      await request(app.getHttpServer())
        .get('/suite-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .expect(401);
    });
  });

  describe('PATCH /suite-de-teste/:id', () => {
    it('should update suite de teste details', async () => {
      const updateSuiteDeTesteDto = {
        nome: 'Suite de Teste Atualizada',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSuiteDeTesteDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSuiteDeTesteId);
      expect(response.body).toHaveProperty('nome', updateSuiteDeTesteDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateSuiteDeTesteDto.descricao,
      );
    });

    it('should add caso de teste to suite', async () => {
      // Create a new caso de teste to add
      const newCasoDeTesteResponse = await request(app.getHttpServer())
        .post('/caso-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Novo Caso de Teste para Suite',
          descricao: 'Descrição do novo caso de teste para adicionar à suite',
          preCondicoes: 'Novas pré-condições',
          passos: 'Novos passos',
          resultadoEsperado: 'Novo resultado esperado',
          projetoId: projetoId,
          requisitoId: requisitoId,
        })
        .expect(201);

      const newCasoDeTesteId = newCasoDeTesteResponse.body.id;

      // Get current caso de teste IDs
      const suiteResponse = await request(app.getHttpServer())
        .get(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const currentCasoDeTesteIds = suiteResponse.body.casosDeTeste.map(
        (caso) => caso.id,
      );

      // Add the new caso de teste
      const updateCasosDeTesteDto = {
        casoDeTesteIds: [...currentCasoDeTesteIds, newCasoDeTesteId],
      };

      const response = await request(app.getHttpServer())
        .patch(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCasosDeTesteDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSuiteDeTesteId);
      expect(response.body).toHaveProperty('casosDeTeste');
      expect(Array.isArray(response.body.casosDeTeste)).toBe(true);
      expect(response.body.casosDeTeste.length).toBe(2);

      // Check if both caso de teste IDs are in the response
      const responseIds = response.body.casosDeTeste.map((caso) => caso.id);
      expect(responseIds).toContain(casoDeTesteId);
      expect(responseIds).toContain(newCasoDeTesteId);
    });

    it('should return 404 for non-existent suite de teste', async () => {
      const updateSuiteDeTesteDto = {
        nome: 'Suite de Teste Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/suite-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSuiteDeTesteDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateSuiteDeTesteDto = {
        nome: 'Suite de Teste Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/suite-de-teste/${createdSuiteDeTesteId}`)
        .send(updateSuiteDeTesteDto)
        .expect(401);
    });
  });

  describe('DELETE /suite-de-teste/:id', () => {
    it('should delete suite de teste by id', async () => {
      // First create a suite de teste that we'll delete
      const createTempSuiteDeTesteDto = {
        nome: 'Suite de Teste Temporária para Deletar',
        descricao: 'Esta suite de teste será deletada',
        projetoId: projetoId,
        casoDeTesteIds: [casoDeTesteId],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/suite-de-teste')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempSuiteDeTesteDto)
        .expect(201);

      const tempSuiteDeTesteId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/suite-de-teste/${tempSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify suite de teste was deleted
      await request(app.getHttpServer())
        .get(`/suite-de-teste/${tempSuiteDeTesteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent suite de teste', async () => {
      await request(app.getHttpServer())
        .delete('/suite-de-teste/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/suite-de-teste/1')
        .expect(401);
    });
  });
});
