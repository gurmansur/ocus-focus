import { Test, TestingModule } from '@nestjs/testing';
import { PlanoDeTesteController } from './plano-de-teste.controller';
import { PlanoDeTesteService } from './plano-de-teste.service';

describe('PlanoDeTesteController', () => {
  let controller: PlanoDeTesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanoDeTesteController],
      providers: [PlanoDeTesteService],
    }).compile();

    controller = module.get<PlanoDeTesteController>(PlanoDeTesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
