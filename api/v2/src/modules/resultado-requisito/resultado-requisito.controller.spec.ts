import { Test, TestingModule } from '@nestjs/testing';
import { ResultadoRequisitoController } from './resultado-requisito.controller';
import { ResultadoRequisitoService } from './resultado-requisito.service';

describe('ResultadoRequisitoController', () => {
  let controller: ResultadoRequisitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultadoRequisitoController],
      providers: [ResultadoRequisitoService],
    }).compile();

    controller = module.get<ResultadoRequisitoController>(ResultadoRequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
