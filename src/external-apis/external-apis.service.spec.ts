import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApisService } from './external-apis.service';

describe('ExternalApisService', () => {
  let service: ExternalApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalApisService],
    }).compile();

    service = module.get<ExternalApisService>(ExternalApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
