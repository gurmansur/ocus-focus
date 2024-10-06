import { Test, TestingModule } from '@nestjs/testing';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

describe('ExecucaoDeTesteService', () => {
  let service: ExecucaoDeTesteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecucaoDeTesteService],
    }).compile();

    service = module.get<ExecucaoDeTesteService>(ExecucaoDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
