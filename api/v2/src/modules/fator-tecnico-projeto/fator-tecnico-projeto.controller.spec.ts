import { Test, TestingModule } from '@nestjs/testing';
import { FatorTecnicoProjetoController } from './fator-tecnico-projeto.controller';
import { FatorTecnicoProjetoService } from './fator-tecnico-projeto.service';

describe('FatorTecnicoProjetoController', () => {
  let controller: FatorTecnicoProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatorTecnicoProjetoController],
      providers: [FatorTecnicoProjetoService],
    }).compile();

    controller = module.get<FatorTecnicoProjetoController>(FatorTecnicoProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
