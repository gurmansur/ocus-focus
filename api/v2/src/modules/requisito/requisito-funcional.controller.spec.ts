import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequisitoController } from './requisito-funcional.controller';
import { RequisitoService } from './requisito-funcional.service';
import { RequisitoFuncional } from './entities/requisito-funcional.entity';

describe('RequisitoController', () => {
  let controller: RequisitoController;

  beforeEach(async () => {
    const mockRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitoController],
      providers: [
        RequisitoService,
        {
          provide: getRepositoryToken(RequisitoFuncional),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<RequisitoController>(RequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
