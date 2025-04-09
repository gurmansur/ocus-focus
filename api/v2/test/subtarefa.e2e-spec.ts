import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('SubtarefaController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let tarefaId: number;
  let createdSubtarefaId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Subtarefa Test User',
      email: 'subtarefa.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'subtarefa.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Subtarefa',
        descricao: 'Projeto criado para testes e2e de Subtarefa',
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
        nome: 'Requisito para Subtarefa',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;

    // Create a tarefa
    const tarefaResponse = await request(app.getHttpServer())
      .post('/tarefa')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        titulo: 'Tarefa para Subtarefa',
        descricao: 'Descrição da tarefa para teste e2e',
        status: 'A FAZER',
        prioridade: 'MÉDIA',
        prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projetoId: projetoId,
        requisitoId: requisitoId,
      });

    tarefaId = tarefaResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /subtarefa', () => {
    it('should create a new subtarefa', async () => {
      const createSubtarefaDto = {
        titulo: 'Subtarefa de Teste',
        descricao: 'Descrição da subtarefa para teste e2e',
        status: 'A FAZER',
        tarefaId: tarefaId,
      };

      const response = await request(app.getHttpServer())
        .post('/subtarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSubtarefaDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('titulo', createSubtarefaDto.titulo);
      expect(response.body).toHaveProperty(
        'descricao',
        createSubtarefaDto.descricao,
      );
      expect(response.body).toHaveProperty('status', createSubtarefaDto.status);
      expect(response.body).toHaveProperty(
        'tarefaId',
        createSubtarefaDto.tarefaId,
      );

      createdSubtarefaId = response.body.id;
    });

    it('should reject subtarefa creation with invalid data', async () => {
      const invalidSubtarefaDto = {
        // Missing required fields
        descricao: 'Descrição sem título',
        tarefaId: tarefaId,
      };

      await request(app.getHttpServer())
        .post('/subtarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidSubtarefaDto)
        .expect(400);
    });

    it('should reject subtarefa with invalid status', async () => {
      const invalidStatusDto = {
        titulo: 'Subtarefa com Status Inválido',
        descricao: 'Descrição da subtarefa com status inválido',
        status: 'STATUS_INVALIDO', // Assuming valid values are A FAZER, EM ANDAMENTO, CONCLUÍDA
        tarefaId: tarefaId,
      };

      await request(app.getHttpServer())
        .post('/subtarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createSubtarefaDto = {
        titulo: 'Subtarefa Não Autorizada',
        descricao: 'Descrição da subtarefa não autorizada',
        status: 'A FAZER',
        tarefaId: tarefaId,
      };

      await request(app.getHttpServer())
        .post('/subtarefa')
        .send(createSubtarefaDto)
        .expect(401);
    });
  });

  describe('GET /subtarefas', () => {
    it('should return all subtarefas', async () => {
      const response = await request(app.getHttpServer())
        .get('/subtarefas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdSubtarefa = response.body.find(
        (subtarefa) => subtarefa.id === createdSubtarefaId,
      );
      expect(createdSubtarefa).toBeDefined();
    });

    it('should return subtarefas filtered by tarefa', async () => {
      const response = await request(app.getHttpServer())
        .get(`/subtarefas?tarefaId=${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned subtarefas should belong to the specified tarefa
      response.body.forEach((subtarefa) => {
        expect(subtarefa.tarefaId).toBe(tarefaId);
      });
    });

    it('should return subtarefas filtered by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/subtarefas?status=A FAZER')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned subtarefas should have the specified status
      response.body.forEach((subtarefa) => {
        expect(subtarefa.status).toBe('A FAZER');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/subtarefas').expect(401);
    });
  });

  describe('GET /subtarefa/:id', () => {
    it('should return subtarefa by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/subtarefa/${createdSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSubtarefaId);
      expect(response.body).toHaveProperty('titulo');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('tarefaId', tarefaId);
    });

    it('should return 404 for non-existent subtarefa', async () => {
      await request(app.getHttpServer())
        .get('/subtarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/subtarefa/${createdSubtarefaId}`)
        .expect(401);
    });
  });

  describe('PATCH /subtarefa/:id', () => {
    it('should update subtarefa details', async () => {
      const updateSubtarefaDto = {
        titulo: 'Subtarefa Atualizada',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/subtarefa/${createdSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSubtarefaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSubtarefaId);
      expect(response.body).toHaveProperty('titulo', updateSubtarefaDto.titulo);
      expect(response.body).toHaveProperty(
        'descricao',
        updateSubtarefaDto.descricao,
      );
    });

    it('should update subtarefa status', async () => {
      const updateStatusDto = {
        status: 'EM ANDAMENTO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/subtarefa/${createdSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSubtarefaId);
      expect(response.body).toHaveProperty('status', updateStatusDto.status);
    });

    it('should complete a subtarefa', async () => {
      const completeStatusDto = {
        status: 'CONCLUÍDA',
      };

      const response = await request(app.getHttpServer())
        .patch(`/subtarefa/${createdSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(completeStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdSubtarefaId);
      expect(response.body).toHaveProperty('status', completeStatusDto.status);
      expect(response.body).toHaveProperty('dataConclusao');
    });

    it('should reject invalid status update', async () => {
      const invalidStatusUpdateDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/subtarefa/${createdSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent subtarefa', async () => {
      const updateSubtarefaDto = {
        titulo: 'Subtarefa Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/subtarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSubtarefaDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateSubtarefaDto = {
        titulo: 'Subtarefa Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/subtarefa/${createdSubtarefaId}`)
        .send(updateSubtarefaDto)
        .expect(401);
    });
  });

  describe('DELETE /subtarefa/:id', () => {
    it('should delete subtarefa by id', async () => {
      // First create a subtarefa that we'll delete
      const createTempSubtarefaDto = {
        titulo: 'Subtarefa Temporária para Deletar',
        descricao: 'Esta subtarefa será deletada',
        status: 'A FAZER',
        tarefaId: tarefaId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/subtarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempSubtarefaDto)
        .expect(201);

      const tempSubtarefaId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/subtarefa/${tempSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify subtarefa was deleted
      await request(app.getHttpServer())
        .get(`/subtarefa/${tempSubtarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent subtarefa', async () => {
      await request(app.getHttpServer())
        .delete('/subtarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/subtarefa/1').expect(401);
    });
  });
});
