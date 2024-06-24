import { Test, TestingModule } from '@nestjs/testing';
import { EstimativaService } from './estimativa.service';

describe('EstimativaService', () => {
  let service: EstimativaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstimativaService],
    }).compile();

    service = module.get<EstimativaService>(EstimativaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
