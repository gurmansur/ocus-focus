import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('StakeholderController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let projetoId: number;
  let createdStakeholderId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Stakeholder Test User',
      email: 'stakeholder.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'stakeholder.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;

    // Create a test projeto
    const projetoResponse = await request(app.getHttpServer())
      .post('/projeto')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Projeto para Teste de Stakeholder',
        descricao: 'Projeto criado para testes e2e de Stakeholder',
        empresa: 'Empresa Teste',
        dataInicio: new Date().toISOString(),
        previsaoFim: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: 'EM ANDAMENTO',
      });

    projetoId = projetoResponse.body.id;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /stakeholder', () => {
    it('should create a new stakeholder', async () => {
      const createStakeholderDto = {
        nome: 'Stakeholder Teste',
        email: 'stakeholder.teste@example.com',
        telefone: '11999998888',
        cargo: 'Diretor de Produto',
        organizacao: 'Empresa Cliente',
        tipoStakeholder: 'EXTERNO', // Assuming types like EXTERNO, INTERNO
        nivelInfluencia: 'ALTO', // Assuming levels like ALTO, MEDIO, BAIXO
        projetoId: projetoId,
      };

      const response = await request(app.getHttpServer())
        .post('/stakeholder')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createStakeholderDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createStakeholderDto.nome);
      expect(response.body).toHaveProperty('email', createStakeholderDto.email);
      expect(response.body).toHaveProperty(
        'telefone',
        createStakeholderDto.telefone,
      );
      expect(response.body).toHaveProperty('cargo', createStakeholderDto.cargo);
      expect(response.body).toHaveProperty(
        'organizacao',
        createStakeholderDto.organizacao,
      );
      expect(response.body).toHaveProperty(
        'tipoStakeholder',
        createStakeholderDto.tipoStakeholder,
      );
      expect(response.body).toHaveProperty(
        'nivelInfluencia',
        createStakeholderDto.nivelInfluencia,
      );
      expect(response.body).toHaveProperty(
        'projetoId',
        createStakeholderDto.projetoId,
      );

      createdStakeholderId = response.body.id;
    });

    it('should reject stakeholder creation with invalid data', async () => {
      const invalidStakeholderDto = {
        // Missing required fields
        email: 'stakeholder.invalido@example.com',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/stakeholder')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStakeholderDto)
        .expect(400);
    });

    it('should reject stakeholder with invalid email format', async () => {
      const invalidEmailDto = {
        nome: 'Stakeholder Email Inválido',
        email: 'email-invalido',
        telefone: '11999998888',
        cargo: 'Diretor de Produto',
        organizacao: 'Empresa Cliente',
        tipoStakeholder: 'EXTERNO',
        nivelInfluencia: 'ALTO',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/stakeholder')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEmailDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const createStakeholderDto = {
        nome: 'Stakeholder Não Autorizado',
        email: 'stakeholder.nao.autorizado@example.com',
        telefone: '11999998888',
        cargo: 'Diretor de Produto',
        organizacao: 'Empresa Cliente',
        tipoStakeholder: 'EXTERNO',
        nivelInfluencia: 'ALTO',
        projetoId: projetoId,
      };

      await request(app.getHttpServer())
        .post('/stakeholder')
        .send(createStakeholderDto)
        .expect(401);
    });
  });

  describe('GET /stakeholders', () => {
    it('should return all stakeholders', async () => {
      const response = await request(app.getHttpServer())
        .get('/stakeholders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdStakeholder = response.body.find(
        (stakeholder) => stakeholder.id === createdStakeholderId,
      );
      expect(createdStakeholder).toBeDefined();
    });

    it('should return stakeholders filtered by projeto', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stakeholders?projetoId=${projetoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned stakeholders should belong to the specified projeto
      response.body.forEach((stakeholder) => {
        expect(stakeholder.projetoId).toBe(projetoId);
      });
    });

    it('should return stakeholders filtered by tipoStakeholder', async () => {
      const response = await request(app.getHttpServer())
        .get('/stakeholders?tipoStakeholder=EXTERNO')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // All returned stakeholders should have the specified tipo
      response.body.forEach((stakeholder) => {
        expect(stakeholder.tipoStakeholder).toBe('EXTERNO');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/stakeholders').expect(401);
    });
  });

  describe('GET /stakeholder/:id', () => {
    it('should return stakeholder by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stakeholder/${createdStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdStakeholderId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('telefone');
      expect(response.body).toHaveProperty('cargo');
      expect(response.body).toHaveProperty('organizacao');
      expect(response.body).toHaveProperty('tipoStakeholder');
      expect(response.body).toHaveProperty('nivelInfluencia');
      expect(response.body).toHaveProperty('projetoId', projetoId);
    });

    it('should return 404 for non-existent stakeholder', async () => {
      await request(app.getHttpServer())
        .get('/stakeholder/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/stakeholder/${createdStakeholderId}`)
        .expect(401);
    });
  });

  describe('PATCH /stakeholder/:id', () => {
    it('should update stakeholder details', async () => {
      const updateStakeholderDto = {
        nome: 'Stakeholder Atualizado',
        email: 'stakeholder.atualizado@example.com',
        cargo: 'Gerente de Produto',
      };

      const response = await request(app.getHttpServer())
        .patch(`/stakeholder/${createdStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStakeholderDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdStakeholderId);
      expect(response.body).toHaveProperty('nome', updateStakeholderDto.nome);
      expect(response.body).toHaveProperty('email', updateStakeholderDto.email);
      expect(response.body).toHaveProperty('cargo', updateStakeholderDto.cargo);
    });

    it('should update stakeholder nivelInfluencia', async () => {
      const updateInfluenciaDto = {
        nivelInfluencia: 'MEDIO',
      };

      const response = await request(app.getHttpServer())
        .patch(`/stakeholder/${createdStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateInfluenciaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdStakeholderId);
      expect(response.body).toHaveProperty(
        'nivelInfluencia',
        updateInfluenciaDto.nivelInfluencia,
      );
    });

    it('should reject invalid email format update', async () => {
      const invalidEmailUpdateDto = {
        email: 'email-invalido',
      };

      await request(app.getHttpServer())
        .patch(`/stakeholder/${createdStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEmailUpdateDto)
        .expect(400);
    });

    it('should return 404 for non-existent stakeholder', async () => {
      const updateStakeholderDto = {
        nome: 'Stakeholder Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/stakeholder/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateStakeholderDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateStakeholderDto = {
        nome: 'Stakeholder Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/stakeholder/${createdStakeholderId}`)
        .send(updateStakeholderDto)
        .expect(401);
    });
  });

  describe('DELETE /stakeholder/:id', () => {
    it('should delete stakeholder by id', async () => {
      // First create a stakeholder that we'll delete
      const createTempStakeholderDto = {
        nome: 'Stakeholder Temporário para Deletar',
        email: 'stakeholder.temporario@example.com',
        telefone: '11999998888',
        cargo: 'Cargo Temporário',
        organizacao: 'Empresa Cliente',
        tipoStakeholder: 'EXTERNO',
        nivelInfluencia: 'BAIXO',
        projetoId: projetoId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/stakeholder')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTempStakeholderDto)
        .expect(201);

      const tempStakeholderId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/stakeholder/${tempStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify stakeholder was deleted
      await request(app.getHttpServer())
        .get(`/stakeholder/${tempStakeholderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent stakeholder', async () => {
      await request(app.getHttpServer())
        .delete('/stakeholder/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .delete(`/stakeholder/${createdStakeholderId}`)
        .expect(401);
    });
  });
});
