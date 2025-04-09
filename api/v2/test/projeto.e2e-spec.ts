import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ProjetoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let colaboradorId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/signup')
      .send({
        nome: 'Projeto Test User',
        email: 'projeto.test@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Gerente de Projetos',
      });

    colaboradorId = signupResponse.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'projeto.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000);

  describe('POST /projeto', () => {
    it('should create a new projeto', async () => {
      const createProjetoDto = {
        nome: 'Projeto de Teste E2E',
        descricao: 'Projeto criado para testes end-to-end',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      };

      const response = await request(app.getHttpServer())
        .post('/projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProjetoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createProjetoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createProjetoDto.descricao,
      );
      expect(response.body).toHaveProperty('empresa', createProjetoDto.empresa);
      expect(response.body).toHaveProperty('status', createProjetoDto.status);

      projetoId = response.body.id;
    });

    it('should reject projeto creation with invalid data', async () => {
      const invalidProjetoDto = {
        // Missing required fields
        descricao: 'Projeto sem nome',
        empresa: 'Empresa Teste',
      };

      await request(app.getHttpServer())
        .post('/projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProjetoDto)
        .expect(400);
    });

    it('should reject projeto with invalid date range', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() + 14 * 24 * 60 * 60 * 1000); // End date before start date

      const invalidDateProjetoDto = {
        nome: 'Projeto com Datas Inválidas',
        descricao: 'Datas estão em ordem errada',
        empresa: 'Empresa Teste',
        dataInicio: startDate.toISOString(),
        previsaoFim: endDate.toISOString(),
        status: 'EM ANDAMENTO',
      };

      await request(app.getHttpServer())
        .post('/projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDateProjetoDto)
        .expect(400);
    });

    it('should reject projeto with invalid status', async () => {
      const invalidStatusProjetoDto = {
        nome: 'Projeto com Status Inválido',
        descricao: 'Status não existe',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .post('/projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusProjetoDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createProjetoDto = {
        nome: 'Projeto Não Autorizado',
        descricao: 'Este projeto não deve ser criado',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      };

      await request(app.getHttpServer())
        .post('/projeto')
        .send(createProjetoDto)
        .expect(401);
    });
  });

  describe('GET /projetos', () => {
    it('should return all projetos', async () => {
      const response = await request(app.getHttpServer())
        .get('/projetos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdProjeto = response.body.find(
        (projeto) => projeto.id === projetoId,
      );
      expect(createdProjeto).toBeDefined();
    });

    it('should return projetos filtered by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/projetos?status=EM ANDAMENTO')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned projetos should have the specified status
      response.body.forEach((projeto) => {
        expect(projeto.status).toBe('EM ANDAMENTO');
      });
    });

    it('should return projetos filtered by empresa', async () => {
      const response = await request(app.getHttpServer())
        .get('/projetos?empresa=Empresa Teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned projetos should have the specified empresa
      response.body.forEach((projeto) => {
        expect(projeto.empresa).toBe('Empresa Teste');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/projetos').expect(401);
    });
  });

  describe('GET /projeto/:id', () => {
    it('should return projeto by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projeto/${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', projetoId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('empresa');
      expect(response.body).toHaveProperty('status');
    });

    it('should return 404 for non-existent projeto', async () => {
      await request(app.getHttpServer())
        .get('/projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/projeto/${projetoId}`)
        .expect(401);
    });
  });

  describe('PATCH /projeto/:id', () => {
    it('should update projeto details', async () => {
      const updateProjetoDto = {
        nome: 'Projeto de Teste Atualizado',
        descricao: 'Descrição atualizada do projeto de teste',
      };

      const response = await request(app.getHttpServer())
        .patch(`/projeto/${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateProjetoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', projetoId);
      expect(response.body).toHaveProperty('nome', updateProjetoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateProjetoDto.descricao,
      );
    });

    it('should update projeto status', async () => {
      const updateStatusDto = {
        status: 'CONCLUIDO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/projeto/${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStatusDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', projetoId);
      expect(response.body).toHaveProperty('status', updateStatusDto.status);
    });

    it('should reject update with invalid status', async () => {
      const invalidStatusDto = {
        status: 'STATUS_INVALIDO',
      };

      await request(app.getHttpServer())
        .patch(`/projeto/${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStatusDto)
        .expect(400);
    });

    it('should return 404 for non-existent projeto', async () => {
      const updateProjetoDto = {
        nome: 'Projeto Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateProjetoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateProjetoDto = {
        nome: 'Projeto Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/projeto/${projetoId}`)
        .send(updateProjetoDto)
        .expect(401);
    });
  });

  describe('POST /projeto/:id/adicionar-colaborador', () => {
    it('should add colaborador to projeto', async () => {
      // First create another colaborador to add to the project
      await request(app.getHttpServer()).post('/signup').send({
        nome: 'Colaborador Para Projeto',
        email: 'colaborador.projeto@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      });

      // Get the colaborador's ID
      const colaboradoresResponse = await request(app.getHttpServer())
        .get('/colaboradores')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const novoColaborador = colaboradoresResponse.body.find(
        (col) => col.email === 'colaborador.projeto@example.com',
      );

      // Add the colaborador to the project
      const adicionarColaboradorDto = {
        colaboradorId: novoColaborador.id,
        funcao: 'DESENVOLVEDOR',
      };

      const response = await request(app.getHttpServer())
        .post(`/projeto/${projetoId}/adicionar-colaborador`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(adicionarColaboradorDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('colaboradorId', novoColaborador.id);
      expect(response.body).toHaveProperty(
        'funcao',
        adicionarColaboradorDto.funcao,
      );
    });

    it('should reject adding colaborador with invalid function', async () => {
      const invalidFuncaoDto = {
        colaboradorId: colaboradorId,
        funcao: 'FUNCAO_INVALIDA',
      };

      await request(app.getHttpServer())
        .post(`/projeto/${projetoId}/adicionar-colaborador`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFuncaoDto)
        .expect(400);
    });

    it('should reject adding non-existent colaborador', async () => {
      const invalidColaboradorDto = {
        colaboradorId: 9999,
        funcao: 'DESENVOLVEDOR',
      };

      await request(app.getHttpServer())
        .post(`/projeto/${projetoId}/adicionar-colaborador`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidColaboradorDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const adicionarColaboradorDto = {
        colaboradorId: colaboradorId,
        funcao: 'DESENVOLVEDOR',
      };

      await request(app.getHttpServer())
        .post(`/projeto/${projetoId}/adicionar-colaborador`)
        .send(adicionarColaboradorDto)
        .expect(401);
    });
  });

  describe('GET /projeto/:id/colaboradores', () => {
    it('should return all colaboradores of a projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/projeto/${projetoId}/colaboradores`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent projeto', async () => {
      await request(app.getHttpServer())
        .get('/projeto/9999/colaboradores')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/projeto/${projetoId}/colaboradores`)
        .expect(401);
    });
  });

  describe('DELETE /projeto/:id', () => {
    it('should delete projeto by id', async () => {
      // First create a projeto that we'll delete
      const createTempProjetoDto = {
        nome: 'Projeto Temporário para Deletar',
        descricao: 'Este projeto será deletado',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'PLANEJADO',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/projeto')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempProjetoDto)
        .expect(201);

      const tempProjetoId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/projeto/${tempProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify projeto was deleted
      await request(app.getHttpServer())
        .get(`/projeto/${tempProjetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent projeto', async () => {
      await request(app.getHttpServer())
        .delete('/projeto/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/projeto/1').expect(401);
    });
  });
});
