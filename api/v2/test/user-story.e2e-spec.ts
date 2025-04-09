import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('UserStoryController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let userStoryId: number;
  let requisitoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'User Story Test User',
      email: 'user.story.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Product Owner',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'user.story.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de User Story',
        descricao: 'Projeto criado para testes e2e de User Story',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;

    // Create a test requisito
    const requisitoResponse = await request(app.getHttpServer())
      .post('/requisito')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        descricao: 'Requisito para Teste de User Story',
        tipo: 'FUNCIONAL',
        prioridade: 'ALTA',
        projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  }, 30000); // Increased timeout to 30 seconds

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000); // Added timeout for cleanup

  describe('POST /user-story', () => {
    it('should create a new user story', async () => {
      const createUserStoryDto = {
        titulo: 'User Story de Teste',
        comoUm: 'usuário do sistema',
        euQuero: 'cadastrar minhas informações',
        paraQue: 'possa acessar funcionalidades personalizadas',
        criteriosDeAceitacao: [
          'Deve validar e-mail',
          'Deve permitir upload de foto',
        ],
        prioridade: 'ALTA',
        estimativa: 5,
        projetoId,
        requisitoId,
      };

      const response = await request(app.getHttpServer())
        .post('/user-story')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createUserStoryDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('titulo', createUserStoryDto.titulo);
      expect(response.body).toHaveProperty('comoUm', createUserStoryDto.comoUm);
      expect(response.body).toHaveProperty(
        'euQuero',
        createUserStoryDto.euQuero,
      );
      expect(response.body).toHaveProperty(
        'paraQue',
        createUserStoryDto.paraQue,
      );
      expect(response.body).toHaveProperty(
        'prioridade',
        createUserStoryDto.prioridade,
      );
      expect(response.body).toHaveProperty(
        'estimativa',
        createUserStoryDto.estimativa,
      );
      expect(response.body).toHaveProperty('projetoId', projetoId);
      expect(response.body).toHaveProperty('requisitoId', requisitoId);

      userStoryId = response.body.id;
    });

    it('should reject user story creation with invalid data', async () => {
      const invalidUserStoryDto = {
        // Missing required fields
        titulo: 'User Story Inválida',
        projetoId,
      };

      await request(app.getHttpServer())
        .post('/user-story')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUserStoryDto)
        .expect(400);
    });

    it('should reject user story with invalid prioridade', async () => {
      const invalidPrioridadeDto = {
        titulo: 'User Story com Prioridade Inválida',
        comoUm: 'usuário do sistema',
        euQuero: 'cadastrar minhas informações',
        paraQue: 'possa acessar funcionalidades personalizadas',
        criteriosDeAceitacao: ['Deve validar e-mail'],
        prioridade: 'PRIORIDADE_INVALIDA',
        estimativa: 3,
        projetoId,
        requisitoId,
      };

      await request(app.getHttpServer())
        .post('/user-story')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPrioridadeDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createUserStoryDto = {
        titulo: 'User Story Não Autorizada',
        comoUm: 'usuário do sistema',
        euQuero: 'cadastrar minhas informações',
        paraQue: 'possa acessar funcionalidades personalizadas',
        criteriosDeAceitacao: ['Deve validar e-mail'],
        prioridade: 'MEDIA',
        estimativa: 3,
        projetoId,
        requisitoId,
      };

      await request(app.getHttpServer())
        .post('/user-story')
        .send(createUserStoryDto)
        .expect(401);
    });
  });

  describe('GET /user-stories', () => {
    it('should return all user stories', async () => {
      const response = await request(app.getHttpServer())
        .get('/user-stories')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdUserStory = response.body.find(
        (us) => us.id === userStoryId,
      );
      expect(createdUserStory).toBeDefined();
    });

    it('should return user stories filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/user-stories?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned user stories should belong to the specified projeto
      response.body.forEach((userStory) => {
        expect(userStory.projetoId).toBe(projetoId);
      });
    });

    it('should return user stories filtered by requisito', async () => {
      const response = await request(app.getHttpServer())
        .get(`/user-stories?requisitoId=${requisitoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned user stories should have the specified requisito
      response.body.forEach((userStory) => {
        expect(userStory.requisitoId).toBe(requisitoId);
      });
    });

    it('should return user stories filtered by prioridade', async () => {
      const response = await request(app.getHttpServer())
        .get('/user-stories?prioridade=ALTA')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned user stories should have the specified prioridade
      response.body.forEach((userStory) => {
        expect(userStory.prioridade).toBe('ALTA');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/user-stories').expect(401);
    });
  });

  describe('GET /user-story/:id', () => {
    it('should return user story by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/user-story/${userStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userStoryId);
      expect(response.body).toHaveProperty('titulo');
      expect(response.body).toHaveProperty('comoUm');
      expect(response.body).toHaveProperty('euQuero');
      expect(response.body).toHaveProperty('paraQue');
      expect(response.body).toHaveProperty('prioridade');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent user story', async () => {
      await request(app.getHttpServer())
        .get('/user-story/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/user-story/${userStoryId}`)
        .expect(401);
    });
  });

  describe('PATCH /user-story/:id', () => {
    it('should update user story details', async () => {
      const updateUserStoryDto = {
        titulo: 'User Story Atualizada',
        prioridade: 'MEDIA',
        estimativa: 8,
      };

      const response = await request(app.getHttpServer())
        .patch(`/user-story/${userStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserStoryDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', userStoryId);
      expect(response.body).toHaveProperty('titulo', updateUserStoryDto.titulo);
      expect(response.body).toHaveProperty(
        'prioridade',
        updateUserStoryDto.prioridade,
      );
      expect(response.body).toHaveProperty(
        'estimativa',
        updateUserStoryDto.estimativa,
      );
    });

    it('should update criterios de aceitacao', async () => {
      const updateCriteriosDto = {
        criteriosDeAceitacao: [
          'Deve validar e-mail',
          'Deve permitir upload de foto',
          'Deve verificar força da senha',
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/user-story/${userStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateCriteriosDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', userStoryId);
      expect(response.body.criteriosDeAceitacao).toEqual(
        updateCriteriosDto.criteriosDeAceitacao,
      );
    });

    it('should reject update with invalid prioridade', async () => {
      const invalidPrioridadeDto = {
        prioridade: 'PRIORIDADE_INVALIDA',
      };

      await request(app.getHttpServer())
        .patch(`/user-story/${userStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidPrioridadeDto)
        .expect(400);
    });

    it('should return 404 for non-existent user story', async () => {
      const updateUserStoryDto = {
        titulo: 'User Story Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/user-story/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserStoryDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateUserStoryDto = {
        titulo: 'User Story Não Autorizada',
      };

      await request(app.getHttpServer())
        .patch(`/user-story/${userStoryId}`)
        .send(updateUserStoryDto)
        .expect(401);
    });
  });

  describe('DELETE /user-story/:id', () => {
    it('should delete user story by id', async () => {
      // First create a user story that we'll delete
      const createTempUserStoryDto = {
        titulo: 'User Story Temporária para Deletar',
        comoUm: 'usuário do sistema',
        euQuero: 'cadastrar minhas informações',
        paraQue: 'possa acessar funcionalidades personalizadas',
        criteriosDeAceitacao: ['Deve validar e-mail'],
        prioridade: 'BAIXA',
        estimativa: 2,
        projetoId,
        requisitoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/user-story')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempUserStoryDto)
        .expect(201);

      const tempUserStoryId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/user-story/${tempUserStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify user story was deleted
      await request(app.getHttpServer())
        .get(`/user-story/${tempUserStoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent user story', async () => {
      await request(app.getHttpServer())
        .delete('/user-story/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/user-story/1').expect(401);
    });
  });
});
