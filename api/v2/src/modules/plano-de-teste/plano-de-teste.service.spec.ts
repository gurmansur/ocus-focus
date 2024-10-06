import { Test, TestingModule } from '@nestjs/testing';
import { PlanoDeTesteService } from './plano-de-teste.service';

describe('PlanoDeTesteService', () => {
  let service: PlanoDeTesteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanoDeTesteService],
    }).compile();

    service = module.get<PlanoDeTesteService>(PlanoDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
