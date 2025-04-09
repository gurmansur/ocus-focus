import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('SprintController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let sprintId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Sprint Test User',
      email: 'sprint.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Gerente de Projetos',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'sprint.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Sprint',
        descricao: 'Projeto criado para testes e2e de Sprint',
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

  describe('POST /sprint', () => {
    it('should create a new sprint', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later

      const createSprintDto = {
        nome: 'Sprint 1',
        descricao: 'Primeira sprint do projeto',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'PLANEJADA',
        projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/sprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSprintDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createSprintDto.nome);
      expect(response.body).toHaveProperty('descricao', createSprintDto.descricao);
      expect(response.body).toHaveProperty('status', createSprintDto.status);
      expect(response.body).toHaveProperty('projetoId', projetoId);

      sprintId = response.body.id;
    });

    it('should reject sprint creation with invalid data', async () => {
      const invalidSprintDto = {
        // Missing required fields
        descricao: 'Sprint sem nome',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/sprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSprintDto)
        .expect(400);
    });

    it('should reject sprint with invalid date range', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() + 14 * 24 * 60 * 60 * 1000); // End date before start date

      const invalidDateSprintDto = {
        nome: 'Sprint com Datas Inválidas',
        descricao: 'Datas estão em ordem errada',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'PLANEJADA',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/sprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDateSprintDto)
        .expect(400);
    });

    it('should reject sprint with invalid status', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

      const invalidStatusSprintDto = {
        nome: 'Sprint com Status Inválido',
        descricao: 'Status não existe',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'STATUS_INVALIDO',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/sprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusSprintDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

      const createSprintDto = {
        nome: 'Sprint Não Autorizada',
        descricao: 'Esta sprint não deve ser criada',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'PLANEJADA',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/sprint')
        .send(createSprintDto)
        .expect(401);
    });
  });

  describe('GET /sprints', () => {
    it('should return all sprints', async () => {
      const response = await request(app.getHttpServer())
        .get('/sprints')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdSprint = response.body.find((sprint) => sprint.id === sprintId);
      expect(createdSprint).toBeDefined();
    });

    it('should return sprints filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sprints?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned sprints should belong to the specified projeto
      response.body.forEach((sprint) => {
        expect(sprint.projetoId).toBe(projetoId);
      });
    });

    it('should return sprints filtered by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/sprints?status=PLANEJADA')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned sprints should have the specified status
      response.body.forEach((sprint) => {
        expect(sprint.status).toBe('PLANEJADA');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/sprints')
        .expect(401);
    });
  });

  describe('GET /sprint/:id', () => {
    it('should return sprint by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sprint/${sprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', sprintId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent sprint', async () => {
      await request(app.getHttpServer())
        .get('/sprint/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/sprint/${sprintId}`)
        .expect(401);
    });
  });

  describe('PATCH /sprint/:id', () => {
    it('should update sprint details', async () => {
      const updateSprintDto = {
        nome: 'Sprint 1 - Atualizada',
        descricao: 'Descrição atualizada da primeira sprint',
      };

      const response = await request(app.getHttpServer())
        .patch(`/sprint/${sprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSprintDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', sprintId);
      expect(response.body).toHaveProperty('nome', updateSprintDto.nome);
      expect(response.body).toHaveProperty('descricao', updateSprintDto.descricao);
    });

    it('should update sprint status', async () => {
      const updateSprintStatusDto = {
        status: 'EM ANDAMENTO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/sprint/${sprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSprintStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', sprintId);
      expect(response.body).toHaveProperty('status', updateSprintStatusDto.status);
    });

    it('should reject update with invalid status', async () => {
      const invalidStatusDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/sprint/${sprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusDto)
        .expect(400);
    });

    it('should return 404 for non-existent sprint', async () => {
      const updateSprintDto = {
        nome: 'Sprint Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/sprint/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSprintDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateSprintDto = {
        nome: 'Sprint Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/sprint/${sprintId}`)
        .send(updateSprintDto)
        .expect(401);
    });
  });

  describe('DELETE /sprint/:id', () => {
    it('should delete sprint by id', async () => {
      // First create a sprint that we'll delete
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const createTempSprintDto = {
        nome: 'Sprint Temporária para Deletar',
        descricao: 'Esta sprint será deletada',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'PLANEJADA',
        projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/sprint')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempSprintDto)
        .expect(201);

      const tempSprintId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/sprint/${tempSprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify sprint was deleted
      await request(app.getHttpServer())
        .get(`/sprint/${tempSprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent sprint', async () => {
      await request(app.getHttpServer())
        .delete('/sprint/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete('/sprint/1')
        .expect(401);
    });
  });
});
