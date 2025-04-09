import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('KanbanController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let createdTarefaId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Kanban Test User',
      email: 'kanban.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'kanban.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Kanban',
        descricao: 'Projeto criado para testes e2e de Kanban',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a requisito for the kanban tasks
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito-funcional')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Requisito para Kanban',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /tarefa', () => {
    it('should create a new tarefa', async () => {
      const createTarefaDto = {
        titulo: 'Tarefa de Teste Kanban',
        descricao: 'Descrição da tarefa para teste e2e',
        status: 'A FAZER',
        prioridade: 'MÉDIA',
        prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projetoId: projetoId,
        requisitoId: requisitoId,
      };

      const response = await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTarefaDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('titulo', createTarefaDto.titulo);
      expect(response.body).toHaveProperty(
        'descricao',
        createTarefaDto.descricao,
      );
      expect(response.body).toHaveProperty('status', createTarefaDto.status);
      expect(response.body).toHaveProperty(
        'prioridade',
        createTarefaDto.prioridade,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createTarefaDto.projetoId,
      );
      expect(response.body).toHaveProperty(
        'requisitoId',
        createTarefaDto.requisitoId,
      );

      createdTarefaId = response.body.id;
    });

    it('should reject tarefa creation with invalid data', async () => {
      const invalidTarefaDto = {
        // Missing required fields
        status: 'A FAZER',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTarefaDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createTarefaDto = {
        titulo: 'Tarefa Não Autorizada',
        descricao: 'Descrição da tarefa não autorizada',
        status: 'A FAZER',
        prioridade: 'MÉDIA',
        prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projetoId: projetoId,
        requisitoId: requisitoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .send(createTarefaDto)
        .expect(401);
    });
  });

  describe('GET /tarefas', () => {
    it('should return all tarefas', async () => {
      const response = await request(app.getHttpServer())
        .get('/tarefas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdTarefa = response.body.find(
        (tarefa) => tarefa.id === createdTarefaId,
      );
      expect(createdTarefa).toBeDefined();
    });

    it('should return tarefas filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefas?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned tarefas should belong to the specified project
      response.body.forEach((tarefa) => {
        expect(tarefa.projetoId).toBe(projetoId);
      });
    });

    it('should return tarefas filtered by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/tarefas?status=A FAZER')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned tarefas should have the specified status
      response.body.forEach((tarefa) => {
        expect(tarefa.status).toBe('A FAZER');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/tarefas').expect(401);
    });
  });

  describe('GET /tarefa/:id', () => {
    it('should return tarefa by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTarefaId);
      expect(response.body).toHaveProperty('titulo');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent tarefa', async () => {
      await request(app.getHttpServer())
        .get('/tarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/tarefa/${createdTarefaId}`)
        .expect(401);
    });
  });

  describe('PATCH /tarefa/:id', () => {
    it('should update tarefa status', async () => {
      const updateTarefaDto = {
        status: 'EM ANDAMENTO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTarefaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTarefaId);
      expect(response.body).toHaveProperty('status', updateTarefaDto.status);
    });

    it('should update tarefa details', async () => {
      const updateTarefaDto = {
        titulo: 'Tarefa Atualizada',
        descricao: 'Descrição atualizada para teste e2e',
        prioridade: 'ALTA',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTarefaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTarefaId);
      expect(response.body).toHaveProperty('titulo', updateTarefaDto.titulo);
      expect(response.body).toHaveProperty(
        'descricao',
        updateTarefaDto.descricao,
      );
      expect(response.body).toHaveProperty(
        'prioridade',
        updateTarefaDto.prioridade,
      );
    });

    it('should return 404 for non-existent tarefa', async () => {
      const updateTarefaDto = {
        status: 'CONCLUÍDA',
      };

      await request(app.getHttpServer())
        .patch('/tarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTarefaDto)
        .expect(404);
    });

    it('should reject invalid status update', async () => {
      const invalidStatusUpdateDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusUpdateDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const updateTarefaDto = {
        status: 'CONCLUÍDA',
      };

      await request(app.getHttpServer())
        .patch(`/tarefa/${createdTarefaId}`)
        .send(updateTarefaDto)
        .expect(401);
    });
  });

  describe('DELETE /tarefa/:id', () => {
    it('should delete tarefa by id', async () => {
      await request(app.getHttpServer())
        .delete(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify tarefa was deleted
      await request(app.getHttpServer())
        .get(`/tarefa/${createdTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent tarefa', async () => {
      await request(app.getHttpServer())
        .delete('/tarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/tarefa/1').expect(401);
    });
  });

  describe('GET /kanban', () => {
    it('should return kanban board for a project', async () => {
      // First create a new tarefa to ensure we have data
      const createTarefaDto = {
        titulo: 'Tarefa para Kanban',
        descricao: 'Descrição da tarefa para kanban',
        status: 'A FAZER',
        prioridade: 'MÉDIA',
        prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projetoId: projetoId,
        requisitoId: requisitoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTarefaDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/kanban?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('aFazer');
      expect(response.body).toHaveProperty('emAndamento');
      expect(response.body).toHaveProperty('concluidas');
      expect(response.body).toHaveProperty('impedidas');

      // Verify that the "A FAZER" column contains our task
      expect(Array.isArray(response.body.aFazer)).toBe(true);
      expect(response.body.aFazer.length).toBeGreaterThan(0);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/kanban?projetoId=${projetoId}`)
        .expect(401);
    });
  });
});
