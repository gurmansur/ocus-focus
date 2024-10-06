import { Test, TestingModule } from '@nestjs/testing';
import { CasoDeTesteService } from './caso-de-teste.service';

describe('CasoDeTesteService', () => {
  let service: CasoDeTesteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasoDeTesteService],
    }).compile();

    service = module.get<CasoDeTesteService>(CasoDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
