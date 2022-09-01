import { Test, TestingModule } from '@nestjs/testing';
import { IconUrlController } from './icon-url.controller';
import { IconUrlService } from './icon-url.service';

describe('IconUrlController', () => {
  let controller: IconUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IconUrlController],
      providers: [IconUrlService],
    }).compile();

    controller = module.get<IconUrlController>(IconUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
