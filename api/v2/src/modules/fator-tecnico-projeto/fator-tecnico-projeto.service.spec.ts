import { Test, TestingModule } from '@nestjs/testing';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

describe('FatorTecnicoProjetoService', () => {
  let service: FatorTecnicoProjetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatorTecnicoProjetoService],
    }).compile();

    service = module.get<FatorTecnicoProjetoService>(FatorTecnicoProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
