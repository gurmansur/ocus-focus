import { Test, TestingModule } from '@nestjs/testing';
import { FatoresTecnicosController } from './fatores-tecnicos.controller';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

describe('FatoresTecnicosController', () => {
  let controller: FatoresTecnicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatoresTecnicosController],
      providers: [FatoresTecnicosService],
    }).compile();

    controller = module.get<FatoresTecnicosController>(FatoresTecnicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
