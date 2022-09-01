import { Test, TestingModule } from '@nestjs/testing';
import { IconUrlService } from './icon-url.service';

describe('IconUrlService', () => {
  let service: IconUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IconUrlService],
    }).compile();

    service = module.get<IconUrlService>(IconUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
