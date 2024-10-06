import { Test, TestingModule } from '@nestjs/testing';
import { CasoDeTesteController } from './caso-de-teste.controller';
import { CasoDeTesteService } from './caso-de-teste.service';

describe('CasoDeTesteController', () => {
  let controller: CasoDeTesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasoDeTesteController],
      providers: [CasoDeTesteService],
    }).compile();

    controller = module.get<CasoDeTesteController>(CasoDeTesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
