import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../config/typeorm.config';
import { SuiteDeTesteController } from './suite-de-teste.controller';
import { SuiteDeTesteService } from './suite-de-teste.service';

describe('SuiteDeTesteController', () => {
  let controller: SuiteDeTesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuiteDeTesteController],
      providers: [SuiteDeTesteService],
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
        }),
      ],
    }).compile();

    controller = module.get<SuiteDeTesteController>(SuiteDeTesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
