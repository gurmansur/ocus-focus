import { Test, TestingModule } from '@nestjs/testing';
import { CenariosController } from './cenarios.controller';
import { CenariosService } from './cenarios.service';

describe('CenariosController', () => {
  let controller: CenariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CenariosController],
      providers: [CenariosService],
    }).compile();

    controller = module.get<CenariosController>(CenariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
