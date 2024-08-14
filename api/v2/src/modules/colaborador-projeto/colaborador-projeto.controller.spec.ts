import { Test, TestingModule } from '@nestjs/testing';
import { ColaboradorProjetoController } from './colaborador-projeto.controller';
import { ColaboradorProjetoService } from './colaborador-projeto.service';

describe('ColaboradorProjetoController', () => {
  let controller: ColaboradorProjetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColaboradorProjetoController],
      providers: [ColaboradorProjetoService],
    }).compile();

    controller = module.get<ColaboradorProjetoController>(ColaboradorProjetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
