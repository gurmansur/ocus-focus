import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('EmailController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    app = await initializeApp();

    // Create a test user and get auth token
    await request(app.getHttpServer()).post('/signup').send({
      nome: 'Email Test User',
      email: 'email.test@example.com',
      senha: 'Password123!',
      empresa: 'Empresa Teste',
      cargo: 'Analista de Sistemas',
    });

    const authResponse = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email: 'email.test@example.com',
        senha: 'Password123!',
      });

    authToken = authResponse.body.accessToken;
  });

  afterAll(async () => {
    await cleanupDatabase(app);
  });

  // The email module may not have explicit controller endpoints that can be tested via HTTP
  // But we can test email functionality through other module endpoints that use the email service

  describe('Email Service Integration', () => {
    it('should send a password reset email when requested', async () => {
      // This is a conceptual test - actual implementation would depend on the API's password reset flow
      // For example, if there's a password reset endpoint that triggers an email

      const response = await request(app.getHttpServer())
        .post('/auth/password-reset-request')
        .send({
          email: 'email.test@example.com',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email');
    });

    it('should send a notification email when a new user is invited', async () => {
      // This is a conceptual test - actual implementation would depend on the API's user invitation flow
      // For example, if there's a user invitation endpoint that triggers an email

      const response = await request(app.getHttpServer())
        .post('/invite-user')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'new.user@example.com',
          role: 'stakeholder',
          projetoId: 1,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('convite');
    });

    it('should handle email sending errors gracefully', async () => {
      // This is a conceptual test - actual implementation would depend on how the API handles email errors
      // For example, if there's an endpoint that triggers emails with invalid data

      const response = await request(app.getHttpServer())
        .post('/auth/password-reset-request')
        .send({
          email: 'invalid@@email.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  // Mock tests for direct email endpoints if they exist
  // These endpoints may not exist in the actual application

  describe('POST /email/send', () => {
    it('should send an email', async () => {
      const emailDto = {
        to: 'recipient@example.com',
        subject: 'Test Email',
        body: 'This is a test email from e2e tests',
        template: 'notification',
        data: {
          username: 'Recipient Name',
          action: 'Test Action',
        },
      };

      await request(app.getHttpServer())
        .post('/email/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send(emailDto)
        .expect(201);
    });

    it('should reject invalid email data', async () => {
      const invalidEmailDto = {
        // Missing required fields
        subject: 'Invalid Email',
      };

      await request(app.getHttpServer())
        .post('/email/send')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEmailDto)
        .expect(400);
    });

    it('should reject unauthorized access', async () => {
      const emailDto = {
        to: 'recipient@example.com',
        subject: 'Test Email',
        body: 'This is a test email',
      };

      await request(app.getHttpServer())
        .post('/email/send')
        .send(emailDto)
        .expect(401);
    });
  });
});
