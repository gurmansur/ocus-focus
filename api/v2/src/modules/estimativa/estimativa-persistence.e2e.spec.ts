import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import {
  EnvironmentalFactorDto,
  TechnicalFactorDto,
} from './dto/estimativa-session.dto';

/**
 * E2E tests for Estimativa persistence
 * Ensures slider data (technical and environmental factors) is correctly saved and retrieved
 */
describe('Estimativa Persistence E2E', () => {
  let app: INestApplication;
  let projectId: number;
  let colaboradorId: number;
  let estimativaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create and Update Estimation Session with Slider Data', () => {
    it('should create a new estimation session with default technical and environmental factors', async () => {
      // First, create a test project and colaborador if they don't exist
      // This assumes the database has at least one project and colaborador
      const response = await request(app.getHttpServer())
        .post('/estimativa')
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .send({
          name: 'Test Estimation Session',
          description: 'Test session for persistence verification',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Test Estimation Session');
      expect(response.body.technicalFactors).toBeDefined();
      expect(response.body.environmentalFactors).toBeDefined();
      expect(Array.isArray(response.body.technicalFactors)).toBe(true);
      expect(Array.isArray(response.body.environmentalFactors)).toBe(true);
      expect(response.body.technicalFactors.length).toBe(13);
      expect(response.body.environmentalFactors.length).toBe(8);

      estimativaId = response.body.id;
    });

    it('should persist technical factor slider values', async () => {
      const technicalFactors: TechnicalFactorDto[] = [
        { id: 'T1', rating: 3 },
        { id: 'T2', rating: 4 },
        { id: 'T3', rating: 2 },
        { id: 'T4', rating: 5 },
        { id: 'T5', rating: 1 },
        { id: 'T6', rating: 3 },
        { id: 'T7', rating: 2 },
        { id: 'T8', rating: 4 },
        { id: 'T9', rating: 3 },
        { id: 'T10', rating: 2 },
        { id: 'T11', rating: 1 },
        { id: 'T12', rating: 5 },
        { id: 'T13', rating: 3 },
      ];

      const updateResponse = await request(app.getHttpServer())
        .patch(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .send({ technicalFactors })
        .expect(200);

      // Verify the response contains the updated factors
      expect(updateResponse.body.technicalFactors).toBeDefined();
      expect(updateResponse.body.technicalFactors.length).toBe(13);

      // Verify each factor has the correct rating
      technicalFactors.forEach((factor) => {
        const returned = updateResponse.body.technicalFactors.find(
          (f) => f.id === factor.id,
        );
        expect(returned).toBeDefined();
        expect(returned.rating).toBe(factor.rating);
      });

      // Verify TCF was recalculated
      expect(updateResponse.body.tcf).toBeDefined();
      expect(updateResponse.body.tfactor).toBeDefined();
    });

    it('should persist environmental factor slider values', async () => {
      const environmentalFactors: EnvironmentalFactorDto[] = [
        { id: 'E1', rating: 4 },
        { id: 'E2', rating: 3 },
        { id: 'E3', rating: 2 },
        { id: 'E4', rating: 5 },
        { id: 'E5', rating: 1 },
        { id: 'E6', rating: 4 },
        { id: 'E7', rating: 2 },
        { id: 'E8', rating: 3 },
      ];

      const updateResponse = await request(app.getHttpServer())
        .patch(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .send({ environmentalFactors })
        .expect(200);

      // Verify the response contains the updated factors
      expect(updateResponse.body.environmentalFactors).toBeDefined();
      expect(updateResponse.body.environmentalFactors.length).toBe(8);

      // Verify each factor has the correct rating
      environmentalFactors.forEach((factor) => {
        const returned = updateResponse.body.environmentalFactors.find(
          (f) => f.id === factor.id,
        );
        expect(returned).toBeDefined();
        expect(returned.rating).toBe(factor.rating);
      });

      // Verify EF was recalculated
      expect(updateResponse.body.ef).toBeDefined();
      expect(updateResponse.body.efactor).toBeDefined();
    });

    it('should retrieve the estimation session with persisted slider data', async () => {
      const getResponse = await request(app.getHttpServer())
        .get(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .expect(200);

      // Verify technical factors are persisted
      expect(getResponse.body.technicalFactors).toBeDefined();
      expect(getResponse.body.technicalFactors.length).toBe(13);

      // Verify specific technical factor values
      const t1 = getResponse.body.technicalFactors.find((f) => f.id === 'T1');
      expect(t1).toBeDefined();
      expect(t1.rating).toBe(3);

      const t4 = getResponse.body.technicalFactors.find((f) => f.id === 'T4');
      expect(t4).toBeDefined();
      expect(t4.rating).toBe(5);

      // Verify environmental factors are persisted
      expect(getResponse.body.environmentalFactors).toBeDefined();
      expect(getResponse.body.environmentalFactors.length).toBe(8);

      // Verify specific environmental factor values
      const e1 = getResponse.body.environmentalFactors.find(
        (f) => f.id === 'E1',
      );
      expect(e1).toBeDefined();
      expect(e1.rating).toBe(4);

      const e4 = getResponse.body.environmentalFactors.find(
        (f) => f.id === 'E4',
      );
      expect(e4).toBeDefined();
      expect(e4.rating).toBe(5);

      // Verify calculated values are present
      expect(getResponse.body.tcf).toBeDefined();
      expect(getResponse.body.ef).toBeDefined();
      expect(getResponse.body.ucp).toBeDefined();
    });

    it('should handle updating both technical and environmental factors simultaneously', async () => {
      const technicalFactors: TechnicalFactorDto[] = Array.from(
        { length: 13 },
        (_, i) => ({
          id: `T${i + 1}`,
          rating: (i % 5) + 1,
        }),
      ) as TechnicalFactorDto[];

      const environmentalFactors: EnvironmentalFactorDto[] = Array.from(
        { length: 8 },
        (_, i) => ({
          id: `E${i + 1}`,
          rating: (i % 4) + 2,
        }),
      ) as EnvironmentalFactorDto[];

      const updateResponse = await request(app.getHttpServer())
        .patch(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .send({ technicalFactors, environmentalFactors })
        .expect(200);

      // Verify all factors were persisted
      expect(updateResponse.body.technicalFactors.length).toBe(13);
      expect(updateResponse.body.environmentalFactors.length).toBe(8);

      // Verify recalculation occurred
      expect(updateResponse.body.tcf).toBeGreaterThan(0);
      expect(updateResponse.body.ef).toBeGreaterThan(0);
      expect(updateResponse.body.ucp).toBeGreaterThan(0);
    });

    it('should persist data across session reload', async () => {
      // First update
      const firstUpdate = await request(app.getHttpServer())
        .patch(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .send({
          technicalFactors: [{ id: 'T1', rating: 5 }],
          environmentalFactors: [{ id: 'E1', rating: 4 }],
        })
        .expect(200);

      // Reload the session
      const reloadResponse = await request(app.getHttpServer())
        .get(`/estimativa/${estimativaId}`)
        .set('Authorization', 'Bearer test-token')
        .set('projeto', '1')
        .expect(200);

      // Verify the data is still there
      const t1 = reloadResponse.body.technicalFactors.find(
        (f) => f.id === 'T1',
      );
      expect(t1.rating).toBe(5);

      const e1 = reloadResponse.body.environmentalFactors.find(
        (f) => f.id === 'E1',
      );
      expect(e1.rating).toBe(4);
    });
  });
});
