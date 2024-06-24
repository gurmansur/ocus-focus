import { Test, TestingModule } from '@nestjs/testing';
import { FatoresTecnicosService } from './fatores-tecnicos.service';

describe('FatoresTecnicosService', () => {
  let service: FatoresTecnicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatoresTecnicosService],
    }).compile();

    service = module.get<FatoresTecnicosService>(FatoresTecnicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
