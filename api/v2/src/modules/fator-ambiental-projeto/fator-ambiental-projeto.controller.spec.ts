import { Test, TestingModule } from '@nestjs/testing';
import { FatorAmbientalProjetoController } from './fator-ambiental-projeto.controller';
import { FatorAmbientalProjetoService } from './fator-ambiental-projeto.service';

describe('FatorAmbientalProjetoController', () => {
  let controller: FatorAmbientalProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatorAmbientalProjetoController],
      providers: [FatorAmbientalProjetoService],
    }).compile();

    controller = module.get<FatorAmbientalProjetoController>(FatorAmbientalProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
