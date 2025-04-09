import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('TarefaController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let sprintId: number;
  let requistoId: number;
  let tarefaId: number;
  let colaboradorId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer()).post('/signup').send({
      nome: 'Tarefa Test User',
      email: 'tarefa.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Desenvolvedor',
    });

    colaboradorId = signupResponse.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'tarefa.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Tarefa',
        descricao: 'Projeto criado para testes e2e de Tarefa',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a test sprint
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later

    const sprintResponse = await request(app.getHttpServer())
      .post('/sprint')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Sprint para Teste de Tarefa',
        descricao: 'Sprint criada para testes e2e de Tarefa',
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        status: 'PLANEJADA',
        projetoId,
      });

    sprintId = sprintResponse.body.id;

    // Create a test requisito
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        descricao: 'Requisito para Teste de Tarefa',
        tipo: 'FUNCIONAL',
        prioridade: 'ALTA',
        projetoId,
      });

    requistoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /tarefa', () => {
    it('should create a new tarefa', async () => {
      const createTarefaDto = {
        titulo: 'Implementar funcionalidade X',
        descricao: 'Descrição detalhada da tarefa de implementação',
        status: 'A FAZER',
        prioridade: 'ALTA',
        horasEstimadas: 8,
        dataInicio: new Date().toISOString(),
        dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projetoId,
        sprintId,
        requisitoId: requistoId,
        responsavelId: colaboradorId
      };

      const response = await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTarefaDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('titulo', createTarefaDto.titulo);
      expect(response.body).toHaveProperty('descricao', createTarefaDto.descricao);
      expect(response.body).toHaveProperty('status', createTarefaDto.status);
      expect(response.body).toHaveProperty('prioridade', createTarefaDto.prioridade);
      expect(response.body).toHaveProperty('horasEstimadas', createTarefaDto.horasEstimadas);
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('sprintId', sprintId);
      expect(response.body).toHaveProperty('requisitoId', requistoId);
      expect(response.body).toHaveProperty('responsavelId', colaboradorId);

      tarefaId = response.body.id;
    });

    it('should reject tarefa creation with invalid data', async () => {
      const invalidTarefaDto = {
        // Missing required fields
        descricao: 'Tarefa sem título',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTarefaDto)
        .expect(400);
    });

    it('should reject tarefa with invalid status', async () => {
      const invalidStatusTarefaDto = {
        titulo: 'Tarefa com Status Inválido',
        descricao: 'Tarefa com status que não existe',
        status: 'STATUS_INVALIDO',
        prioridade: 'ALTA',
        horasEstimadas: 8,
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusTarefaDto)
        .expect(400);
    });

    it('should reject tarefa with invalid priority', async () => {
      const invalidPriorityTarefaDto = {
        titulo: 'Tarefa com Prioridade Inválida',
        descricao: 'Tarefa com prioridade que não existe',
        status: 'A FAZER',
        prioridade: 'PRIORIDADE_INVALIDA',
        horasEstimadas: 8,
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPriorityTarefaDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createTarefaDto = {
        titulo: 'Tarefa Não Autorizada',
        descricao: 'Esta tarefa não deve ser criada',
        status: 'A FAZER',
        prioridade: 'ALTA',
        horasEstimadas: 8,
        projetoId,
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

      const createdTarefa = response.body.find((tarefa) => tarefa.id === tarefaId);
      expect(createdTarefa).toBeDefined();
    });

    it('should return tarefas filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefas?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned tarefas should belong to the specified projeto
      response.body.forEach((tarefa) => {
        expect(tarefa.projetoId).toBe(projetoId);
      });
    });

    it('should return tarefas filtered by sprint', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefas?sprintId=${sprintId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned tarefas should belong to the specified sprint
      response.body.forEach((tarefa) => {
        expect(tarefa.sprintId).toBe(sprintId);
      });
    });

    it('should return tarefas filtered by responsavel', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefas?responsavelId=${colaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned tarefas should belong to the specified responsavel
      response.body.forEach((tarefa) => {
        expect(tarefa.responsavelId).toBe(colaboradorId);
      });
    });

    it('should return tarefas filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefas?requisitoId=${requistoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned tarefas should belong to the specified requisito
      response.body.forEach((tarefa) => {
        expect(tarefa.requisitoId).toBe(requistoId);
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

    it('should return tarefas filtered by prioridade', async () => {
      const response = await request(app.getHttpServer())
        .get('/tarefas?prioridade=ALTA')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned tarefas should have the specified prioridade
      response.body.forEach((tarefa) => {
        expect(tarefa.prioridade).toBe('ALTA');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get('/tarefas')
        .expect(401);
    });
  });

  describe('GET /tarefa/:id', () => {
    it('should return tarefa by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', tarefaId);
      expect(response.body).toHaveProperty('titulo');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('prioridade');
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('sprintId', sprintId);
      expect(response.body).toHaveProperty('requisitoId', requistoId);
      expect(response.body).toHaveProperty('responsavelId', colaboradorId);
    });

    it('should return 404 for non-existent tarefa', async () => {
      await request(app.getHttpServer())
        .get('/tarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/tarefa/${tarefaId}`)
        .expect(401);
    });
  });

  describe('PATCH /tarefa/:id', () => {
    it('should update tarefa details', async () => {
      const updateTarefaDto = {
        titulo: 'Tarefa Atualizada',
        descricao: 'Descrição atualizada da tarefa',
        horasEstimadas: 12,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTarefaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', tarefaId);
      expect(response.body).toHaveProperty('titulo', updateTarefaDto.titulo);
      expect(response.body).toHaveProperty('descricao', updateTarefaDto.descricao);
      expect(response.body).toHaveProperty('horasEstimadas', updateTarefaDto.horasEstimadas);
    });

    it('should update tarefa status', async () => {
      const updateStatusDto = {
        status: 'EM ANDAMENTO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', tarefaId);
      expect(response.body).toHaveProperty('status', updateStatusDto.status);
    });

    it('should update tarefa responsavel', async () => {
      // First create another colaborador to be the new responsavel
      await request(app.getHttpServer()).post('/signup').send({
        nome: 'Novo Responsável',
        email: 'novo.responsavel@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      });

      // Get the new colaborador's ID
      const colaboradoresResponse = await request(app.getHttpServer())
        .get('/colaboradores')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const novoResponsavel = colaboradoresResponse.body.find(
        (col) => col.email === 'novo.responsavel@example.com'
      );

      // Update the tarefa with the new responsavel
      const updateResponsavelDto = {
        responsavelId: novoResponsavel.id,
      };

      const response = await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateResponsavelDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', tarefaId);
      expect(response.body).toHaveProperty('responsavelId', novoResponsavel.id);
    });

    it('should reject update with invalid status', async () => {
      const invalidStatusDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusDto)
        .expect(400);
    });

    it('should reject update with invalid prioridade', async () => {
      const invalidPrioridadeDto = {
        prioridade: 'PRIORIDADE_INVALIDA',
      };

      await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPrioridadeDto)
        .expect(400);
    });

    it('should return 404 for non-existent tarefa', async () => {
      const updateTarefaDto = {
        titulo: 'Tarefa Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/tarefa/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTarefaDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateTarefaDto = {
        titulo: 'Tarefa Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/tarefa/${tarefaId}`)
        .send(updateTarefaDto)
        .expect(401);
    });
  });

  describe('DELETE /tarefa/:id', () => {
    it('should delete tarefa by id', async () => {
      // First create a tarefa that we'll delete
      const createTempTarefaDto = {
        titulo: 'Tarefa Temporária para Deletar',
        descricao: 'Esta tarefa será deletada',
        status: 'A FAZER',
        prioridade: 'MEDIA',
        horasEstimadas: 4,
        projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/tarefa')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempTarefaDto)
        .expect(201);

      const tempTarefaId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/tarefa/${tempTarefaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify tarefa was deleted
      await request(app.getHttpServer())
        .get(`/tarefa/${tempTarefaId}`)
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
      await request(app.getHttpServer())
        .delete('/tarefa/1')
        .expect(401);
    });
  });
});
