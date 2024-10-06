import { Test, TestingModule } from '@nestjs/testing';
import { ExecucaoDeTesteController } from './execucao-de-teste.controller';
import { ExecucaoDeTesteService } from './execucao-de-teste.service';

describe('ExecucaoDeTesteController', () => {
  let controller: ExecucaoDeTesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecucaoDeTesteController],
      providers: [ExecucaoDeTesteService],
    }).compile();

    controller = module.get<ExecucaoDeTesteController>(ExecucaoDeTesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
