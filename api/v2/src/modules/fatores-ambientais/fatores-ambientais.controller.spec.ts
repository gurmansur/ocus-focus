import { Test, TestingModule } from '@nestjs/testing';
import { FatoresAmbientaisController } from './fatores-ambientais.controller';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

describe('FatoresAmbientaisController', () => {
  let controller: FatoresAmbientaisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FatoresAmbientaisController],
      providers: [FatoresAmbientaisService],
    }).compile();

    controller = module.get<FatoresAmbientaisController>(FatoresAmbientaisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
