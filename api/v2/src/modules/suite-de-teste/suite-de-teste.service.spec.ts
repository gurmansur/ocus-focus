import { Test, TestingModule } from '@nestjs/testing';
import { SuiteDeTesteService } from './suite-de-teste.service';

describe('SuiteDeTesteService', () => {
  let service: SuiteDeTesteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuiteDeTesteService],
    }).compile();

    service = module.get<SuiteDeTesteService>(SuiteDeTesteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
