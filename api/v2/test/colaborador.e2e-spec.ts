import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('ColaboradorController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let colaboradorId: number;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    const signupResponse = await request(app.getHttpServer())
      .post('/signup')
      .send({
        nome: 'Colaborador Test User',
        email: 'colaborador.test@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Administrador',
      });

    colaboradorId = signupResponse.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'colaborador.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000);

  describe('POST /signup', () => {
    it('should create a new colaborador', async () => {
      const createColaboradorDto = {
        nome: 'Novo Colaborador',
        email: 'novo.colaborador@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      };

      const response = await request(app.getHttpServer())
        .post('/signup')
        .send(createColaboradorDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', createColaboradorDto.nome);
      expect(response.body).toHaveProperty('email', createColaboradorDto.email);
      expect(response.body).toHaveProperty(
        'empresa',
        createColaboradorDto.empresa,
      );
      expect(response.body).toHaveProperty('cargo', createColaboradorDto.cargo);
      expect(response.body).not.toHaveProperty('senha'); // Password should not be returned
    });

    it('should reject colaborador creation with missing required fields', async () => {
      const invalidColaboradorDto = {
        // Missing required fields
        nome: 'Colaborador Inválido',
        email: 'colaborador.invalido@example.com',
      };

      await request(app.getHttpServer())
        .post('/signup')
        .send(invalidColaboradorDto)
        .expect(400);
    });

    it('should reject colaborador with invalid email format', async () => {
      const invalidEmailDto = {
        nome: 'Colaborador Email Inválido',
        email: 'emailinvalido',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      };

      await request(app.getHttpServer())
        .post('/signup')
        .send(invalidEmailDto)
        .expect(400);
    });

    it('should reject colaborador with duplicate email', async () => {
      const duplicateEmailDto = {
        nome: 'Colaborador Duplicado',
        email: 'colaborador.test@example.com', // Email already used in beforeAll
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Desenvolvedor',
      };

      await request(app.getHttpServer())
        .post('/signup')
        .send(duplicateEmailDto)
        .expect(400);
    });
  });

  describe('POST /signin-colaborador', () => {
    it('should authenticate a valid colaborador', async () => {
      const signinDto = {
        email: 'colaborador.test@example.com',
        senha: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/signin-colaborador')
        .send(signinDto)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).toBeTruthy();
    });

    it('should reject authentication with invalid credentials', async () => {
      const invalidSigninDto = {
        email: 'colaborador.test@example.com',
        senha: 'WrongPassword',
      };

      await request(app.getHttpServer())
        .post('/signin-colaborador')
        .send(invalidSigninDto)
        .expect(401);
    });

    it('should reject authentication with non-existent user', async () => {
      const nonExistentSigninDto = {
        email: 'nonexistent@example.com',
        senha: 'Password123!',
      };

      await request(app.getHttpServer())
        .post('/signin-colaborador')
        .send(nonExistentSigninDto)
        .expect(401);
    });
  });

  describe('GET /colaboradores', () => {
    it('should return all colaboradores', async () => {
      const response = await request(app.getHttpServer())
        .get('/colaboradores')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const createdColaborador = response.body.find(
        (colaborador) => colaborador.id === colaboradorId,
      );
      expect(createdColaborador).toBeDefined();
    });

    it('should return colaboradores filtered by empresa', async () => {
      const response = await request(app.getHttpServer())
        .get('/colaboradores?empresa=Empresa Teste')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // All returned colaboradores should belong to the specified empresa
      response.body.forEach((colaborador) => {
        expect(colaborador.empresa).toBe('Empresa Teste');
      });
    });

    it('should return colaboradores filtered by cargo', async () => {
      const response = await request(app.getHttpServer())
        .get('/colaboradores?cargo=Administrador')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // All returned colaboradores should have the specified cargo
      response.body.forEach((colaborador) => {
        expect(colaborador.cargo).toBe('Administrador');
      });
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).get('/colaboradores').expect(401);
    });
  });

  describe('GET /colaborador/:id', () => {
    it('should return colaborador by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/colaborador/${colaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', colaboradorId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('empresa');
      expect(response.body).toHaveProperty('cargo');
      expect(response.body).not.toHaveProperty('senha'); // Password should not be returned
    });

    it('should return 404 for non-existent colaborador', async () => {
      await request(app.getHttpServer())
        .get('/colaborador/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer())
        .get(`/colaborador/${colaboradorId}`)
        .expect(401);
    });
  });

  describe('PATCH /colaborador/:id', () => {
    it('should update colaborador details', async () => {
      const updateColaboradorDto = {
        nome: 'Colaborador Atualizado',
        cargo: 'Gerente de Projetos',
      };

      const response = await request(app.getHttpServer())
        .patch(`/colaborador/${colaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateColaboradorDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', colaboradorId);
      expect(response.body).toHaveProperty('nome', updateColaboradorDto.nome);
      expect(response.body).toHaveProperty('cargo', updateColaboradorDto.cargo);
    });

    it('should update colaborador password', async () => {
      const updateSenhaDto = {
        senha: 'NewPassword123!',
      };

      const response = await request(app.getHttpServer())
        .patch(`/colaborador/${colaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateSenhaDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', colaboradorId);

      // Verify that the new password works
      const signinDto = {
        email: 'colaborador.test@example.com',
        senha: 'NewPassword123!',
      };

      await request(app.getHttpServer())
        .post('/signin-colaborador')
        .send(signinDto)
        .expect(200);
    });

    it('should return 404 for non-existent colaborador', async () => {
      const updateColaboradorDto = {
        nome: 'Colaborador Inexistente',
      };

      await request(app.getHttpServer())
        .patch('/colaborador/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateColaboradorDto)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      const updateColaboradorDto = {
        nome: 'Colaborador Não Autorizado',
      };

      await request(app.getHttpServer())
        .patch(`/colaborador/${colaboradorId}`)
        .send(updateColaboradorDto)
        .expect(401);
    });
  });

  describe('DELETE /colaborador/:id', () => {
    it('should delete colaborador by id', async () => {
      // First create a colaborador that we'll delete
      const createTempColaboradorDto = {
        nome: 'Colaborador Temporário para Deletar',
        email: 'temp.colaborador@example.com',
        senha: 'Password123!',
        empresa: 'Empresa Teste',
        cargo: 'Estagiário',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/signup')
        .send(createTempColaboradorDto)
        .expect(201);

      const tempColaboradorId = createResponse.body.id;

      // Now delete it
      await request(app.getHttpServer())
        .delete(`/colaborador/${tempColaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify colaborador was deleted
      await request(app.getHttpServer())
        .get(`/colaborador/${tempColaboradorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent colaborador', async () => {
      await request(app.getHttpServer())
        .delete('/colaborador/9999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject unauthorized access', async () => {
      await request(app.getHttpServer()).delete('/colaborador/1').expect(401);
    });
  });
});
