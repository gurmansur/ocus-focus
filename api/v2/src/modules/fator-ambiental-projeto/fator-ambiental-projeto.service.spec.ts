import { Test, TestingModule } from '@nestjs/testing';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

describe('FatorAmbientalProjetoService', () => {
  let service: FatorAmbientalProjetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatorAmbientalProjetoService],
    }).compile();

    service = module.get<FatorAmbientalProjetoService>(FatorAmbientalProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
