import { Controller, Post } from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { DummyGeneratorService } from './dummy-generator.service';

@Controller('dummy-generator')
export class DummyGeneratorController {
   constructor(private readonly dummyGeneratorService: DummyGeneratorService) {}

   @Post('/trades')
   generateDummyTrades(@GetCurrentUser('sub') id: string) {
      return this.dummyGeneratorService.generateTrades(id);
   }
}
