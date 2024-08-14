import { Test, TestingModule } from '@nestjs/testing';
import { StatusPriorizacaoController } from './status-priorizacao.controller';
import { StatusPriorizacaoService } from './status-priorizacao.service';

describe('StatusPriorizacaoController', () => {
  let controller: StatusPriorizacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPriorizacaoController],
      providers: [StatusPriorizacaoService],
    }).compile();

    controller = module.get<StatusPriorizacaoController>(StatusPriorizacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
