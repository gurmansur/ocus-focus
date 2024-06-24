import { Test, TestingModule } from '@nestjs/testing';
import { CasoUsoController } from './caso-uso.controller';
import { CasoUsoService } from './caso-uso.service';

describe('CasoUsoController', () => {
  let controller: CasoUsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasoUsoController],
      providers: [CasoUsoService],
    }).compile();

    controller = module.get<CasoUsoController>(CasoUsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
