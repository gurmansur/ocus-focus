import { Test, TestingModule } from '@nestjs/testing';
import { ResultadoRequisitoService } from './resultado-requisito.service';

describe('ResultadoRequisitoService', () => {
  let service: ResultadoRequisitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultadoRequisitoService],
    }).compile();

    service = module.get<ResultadoRequisitoService>(ResultadoRequisitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
