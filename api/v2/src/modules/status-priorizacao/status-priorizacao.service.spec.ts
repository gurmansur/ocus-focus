import { Test, TestingModule } from '@nestjs/testing';
import { StatusPriorizacaoService } from './status-priorizacao.service';

describe('StatusPriorizacaoService', () => {
  let service: StatusPriorizacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusPriorizacaoService],
    }).compile();

    service = module.get<StatusPriorizacaoService>(StatusPriorizacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
