import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanupDatabase, initializeApp } from './test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeApp();
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase(app);
  }, 10000);

  describe('GET /', () => {
    it('should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => expect(res.text).toContain('Hello World!'));
    });
  });

  describe('GET /status', () => {
    it('should return API status information', () => {
      return request(app.getHttpServer())
        .get('/status')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('version');
          expect(res.body.status).toBe('ok');
        });
    });
  });

  describe('GET /info', () => {
    it('should return API info', () => {
      return request(app.getHttpServer())
        .get('/info')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('version');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('environment');
          expect(res.body).toHaveProperty('uptime');
        });
    });
  });
});
