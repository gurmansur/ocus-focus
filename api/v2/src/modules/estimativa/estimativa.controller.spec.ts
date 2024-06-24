import { Test, TestingModule } from '@nestjs/testing';
import { EstimativaController } from './estimativa.controller';
import { EstimativaService } from './estimativa.service';

describe('EstimativaController', () => {
  let controller: EstimativaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimativaController],
      providers: [EstimativaService],
    }).compile();

    controller = module.get<EstimativaController>(EstimativaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
