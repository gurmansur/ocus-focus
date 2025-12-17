import { Test, TestingModule } from '@nestjs/testing';
import { FatoresAmbientaisService } from './fatores-ambientais.service';

describe('FatoresAmbientaisService', () => {
  let service: FatoresAmbientaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FatoresAmbientaisService],
    }).compile();

    service = module.get<FatoresAmbientaisService>(FatoresAmbientaisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
