import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ArquivoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdArquivoId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Arquivo Test User',
      email: 'arquivo.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const response = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'arquivo.test@example.com',
        senha: 'Password123!',
      });

    authToken = response.body.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /arquivo', () => {
    it('should create a new arquivo', async () => {
      const createArquivoDto = {
        nome: 'Arquivo de Teste E2E',
        descricao: 'Descrição do arquivo para teste e2e',
        url: 'https://example.com/arquivo-teste.pdf',
        tipo: 'pdf',
      };

      const response = await request(app.getHttpServer())
        .post('/arquivo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createArquivoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createArquivoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        createArquivoDto.descricao,
      );
      expect(response.body).toHaveProperty('url', createArquivoDto.url);
      expect(response.body).toHaveProperty('tipo', createArquivoDto.tipo);

      createdArquivoId = response.body.id;
    });

    it('should reject unauthorized access', async () => {
      const createArquivoDto = {
        nome: 'Arquivo Não Autorizado',
        descricao: 'Teste de acesso não autorizado',
        url: 'https://example.com/arquivo.pdf',
        tipo: 'pdf',
      };

      await request(app.getHttpServer())
        .post('/arquivo')
        .send(createArquivoDto)
        .expect(401);
    });
  });

  describe('GET /arquivo', () => {
    it('should return all arquivos', async () => {
      const response = await request(app.getHttpServer())
        .get('/arquivo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/arquivo').expect(401);
    });
  });

  describe('GET /arquivo/:id', () => {
    it('should return arquivo by id', async () => {
      await request(app.getHttpServer())
        .get(`/arquivo/${createdArquivoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdArquivoId);
        });
    });

    it('should return 404 for non-existent arquivo', async () => {
      await request(app.getHttpServer())
        .get('/arquivo/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/arquivo/${createdArquivoId}`)
        .expect(401);
    });
  });

  describe('PATCH /arquivo/:id', () => {
    it('should update arquivo by id', async () => {
      const updateArquivoDto = {
        nome: 'Arquivo Atualizado E2E',
        descricao: 'Descrição atualizada para teste e2e',
      };

      const response = await request(app.getHttpServer())
        .patch(`/arquivo/${createdArquivoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateArquivoDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdArquivoId);
      expect(response.body).toHaveProperty('nome', updateArquivoDto.nome);
      expect(response.body).toHaveProperty(
        'descricao',
        updateArquivoDto.descricao,
      );
    });

    it('should return 404 for non-existent arquivo', async () => {
      const updateArquivoDto = {
        nome: 'Arquivo Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/arquivo/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateArquivoDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateArquivoDto = {
        nome: 'Arquivo Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/arquivo/${createdArquivoId}`)
        .send(updateArquivoDto)
        .expect(401);
    });
  });

  describe('DELETE /arquivo/:id', () => {
    it('should delete arquivo by id', async () => {
      await request(app.getHttpServer())
        .delete(`/arquivo/${createdArquivoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify arquivo was deleted
      await request(app.getHttpServer())
        .get(`/arquivo/${createdArquivoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent arquivo', async () => {
      await request(app.getHttpServer())
        .delete('/arquivo/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/arquivo/1').expect(401);
    });
  });
});
