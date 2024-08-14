import { Test, TestingModule } from '@nestjs/testing';
import { ColaboradorProjetoService } from './colaborador-projeto.service';

describe('ColaboradorProjetoService', () => {
  let service: ColaboradorProjetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColaboradorProjetoService],
    }).compile();

    service = module.get<ColaboradorProjetoService>(ColaboradorProjetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
