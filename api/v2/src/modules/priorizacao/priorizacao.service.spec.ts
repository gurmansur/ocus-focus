import { Test, TestingModule } from '@nestjs/testing';
import { PriorizacaoService } from './priorizacao.service';

describe('PriorizacaoService', () => {
  let service: PriorizacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriorizacaoService],
    }).compile();

    service = module.get<PriorizacaoService>(PriorizacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
