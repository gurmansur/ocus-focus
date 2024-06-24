import { Test, TestingModule } from '@nestjs/testing';
import { CasoUsoService } from './caso-uso.service';

describe('CasoUsoService', () => {
  let service: CasoUsoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasoUsoService],
    }).compile();

    service = module.get<CasoUsoService>(CasoUsoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
