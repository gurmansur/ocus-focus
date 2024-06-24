import { Test, TestingModule } from '@nestjs/testing';
import { PriorizacaoController } from './priorizacao.controller';
import { PriorizacaoService } from './priorizacao.service';

describe('PriorizacaoController', () => {
  let controller: PriorizacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriorizacaoController],
      providers: [PriorizacaoService],
    }).compile();

    controller = module.get<PriorizacaoController>(PriorizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
