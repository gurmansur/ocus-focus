import { Test, TestingModule } from '@nestjs/testing';
import { SubtarefaService } from './subtarefa.service';

describe('SubtarefaService', () => {
  let service: SubtarefaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubtarefaService],
    }).compile();

    service = module.get<SubtarefaService>(SubtarefaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
