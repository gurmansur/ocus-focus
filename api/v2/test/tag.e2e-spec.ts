import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('TagController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let requisitoId: number;
  let createdTagId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Tag Test User',
      email: 'tag.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'tag.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Tag',
        descricao: 'Projeto criado para testes e2e de Tag',
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
        nome: 'Requisito para Tag',
        especificacao: 'Especificação do requisito para teste e2e',
        projetoId: projetoId,
        numeroIdentificador: 1,
      });

    requisitoId = requisitoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /tag', () => {
    it('should create a new tag', async () => {
      const createTagDto = {
        nome: 'TagTeste',
        cor: '#FF5733',
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/tag')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTagDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createTagDto.nome);
      expect(response.body).toHaveProperty('cor', createTagDto.cor);
      expect(response.body).toHaveProperty('projetoId', createTagDto.projetoId);

      createdTagId = response.body.id;
    });

    it('should reject tag creation with invalid data', async () => {
      const invalidTagDto = {
        // Missing required fields
        cor: '#FF5733',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tag')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTagDto)
        .expect(400);
    });

    it('should reject tag with invalid color format', async () => {
      const invalidColorDto = {
        nome: 'TagCorInvalida',
        cor: 'invalid-color', // Not a hex color code
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tag')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidColorDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createTagDto = {
        nome: 'TagNaoAutorizada',
        cor: '#FF5733',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/tag')
        .send(createTagDto)
        .expect(401);
    });
  });

  describe('GET /tags', () => {
    it('should return all tags', async () => {
      const response = await request(app.getHttpServer())
        .get('/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdTag = response.body.find((tag) => tag.id === createdTagId);
      expect(createdTag).toBeDefined();
    });

    it('should return tags filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tags?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned tags should belong to the specified projeto
      response.body.forEach((tag) => {
        expect(tag.projetoId).toBe(projetoId);
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/tags').expect(401);
    });
  });

  describe('GET /tag/:id', () => {
    it('should return tag by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTagId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('cor');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .get('/tag/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/tag/${createdTagId}`)
        .expect(401);
    });
  });

  describe('POST /requisito/:id/tag/:tagId', () => {
    it('should add tag to requisito', async () => {
      const response = await request(app.getHttpServer())
        .post(`/requisito/${requisitoId}/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', requisitoId);
      expect(response.body).toHaveProperty('tags');
      expect(Array.isArray(response.body.tags)).toBe(true);
      expect(response.body.tags.length).toBeGreaterThan(0);

      const tagExists = response.body.tags.some(
        (tag) => tag.id === createdTagId,
      );
      expect(tagExists).toBe(true);
    });

    it('should reject adding non-existent tag', async () => {
      await request(app.getHttpServer())
        .post(`/requisito/${requisitoId}/tag/9999`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject adding tag to non-existent requisito', async () => {
      await request(app.getHttpServer())
        .post(`/requisito/9999/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .post(`/requisito/${requisitoId}/tag/${createdTagId}`)
        .expect(401);
    });
  });

  describe('DELETE /requisito/:id/tag/:tagId', () => {
    it('should remove tag from requisito', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/requisito/${requisitoId}/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', requisitoId);

      // Check if the tag was removed
      const tagExists = response.body.tags
        ? response.body.tags.some((tag) => tag.id === createdTagId)
        : false;
      expect(tagExists).toBe(false);
    });

    it('should reject removing non-existent tag', async () => {
      await request(app.getHttpServer())
        .delete(`/requisito/${requisitoId}/tag/9999`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject removing tag from non-existent requisito', async () => {
      await request(app.getHttpServer())
        .delete(`/requisito/9999/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete(`/requisito/${requisitoId}/tag/${createdTagId}`)
        .expect(401);
    });
  });

  describe('PATCH /tag/:id', () => {
    it('should update tag details', async () => {
      const updateTagDto = {
        nome: 'TagAtualizada',
        cor: '#33FF57',
      };

      const response = await request(app.getHttpServer())
        .patch(`/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTagDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdTagId);
      expect(response.body).toHaveProperty('nome', updateTagDto.nome);
      expect(response.body).toHaveProperty('cor', updateTagDto.cor);
    });

    it('should reject invalid color format update', async () => {
      const invalidColorUpdateDto = {
        cor: 'invalid-color',
      };

      await request(app.getHttpServer())
        .patch(`/tag/${createdTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidColorUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent tag', async () => {
      const updateTagDto = {
        nome: 'TagInexistente',
      };

      await request(app.getHttpServer())
        .patch('/tag/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTagDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateTagDto = {
        nome: 'TagNaoAutorizada',
      };

      await request(app.getHttpServer())
        .patch(`/tag/${createdTagId}`)
        .send(updateTagDto)
        .expect(401);
    });
  });

  describe('DELETE /tag/:id', () => {
    it('should delete tag by id', async () => {
      // First create a tag that we'll delete
      const createTempTagDto = {
        nome: 'TagTemporaria',
        cor: '#3357FF',
        projetoId: projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/tag')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempTagDto)
        .expect(201);

      const tempTagId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/tag/${tempTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify tag was deleted
      await request(app.getHttpServer())
        .get(`/tag/${tempTagId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent tag', async () => {
      await request(app.getHttpServer())
        .delete('/tag/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete(`/tag/${createdTagId}`)
        .expect(401);
    });
  });
});
