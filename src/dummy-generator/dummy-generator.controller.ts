import { Controller, Post } from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { ResponseStatus, SuccessResponse } from '../types/api';
import { DummyGeneratorService } from './dummy-generator.service';

@Controller('dummy-generator')
export class DummyGeneratorController {
   constructor(private readonly dummyGeneratorService: DummyGeneratorService) {}

   @Post('/trades')
   async generateDummyTrades(
      @GetCurrentUser('sub') id: string,
   ): Promise<SuccessResponse> {
      await this.dummyGeneratorService.generateTrades(id);
      return {
         status: ResponseStatus.success,
      };
   }
}
