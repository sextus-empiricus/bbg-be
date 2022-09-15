import { Test, TestingModule } from '@nestjs/testing';
import { DummyGeneratorService } from '../dummy-generator.service';

describe('DummyGeneratorService', () => {
  let service: DummyGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DummyGeneratorService],
    }).compile();

    service = module.get<DummyGeneratorService>(DummyGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
