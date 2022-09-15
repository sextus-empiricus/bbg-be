import { Test, TestingModule } from '@nestjs/testing';
import { DummyGeneratorController } from '../dummy-generator.controller';
import { DummyGeneratorService } from '../dummy-generator.service';

describe('DummyGeneratorController', () => {
  let controller: DummyGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DummyGeneratorController],
      providers: [DummyGeneratorService],
    }).compile();

    controller = module.get<DummyGeneratorController>(DummyGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
