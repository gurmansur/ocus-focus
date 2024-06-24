import { Test, TestingModule } from '@nestjs/testing';
import { CenariosService } from './cenarios.service';

describe('CenariosService', () => {
  let service: CenariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CenariosService],
    }).compile();

    service = module.get<CenariosService>(CenariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
