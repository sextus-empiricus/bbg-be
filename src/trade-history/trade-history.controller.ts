import {
   Body,
   Controller,
   Param,
   Patch,
   Post,
   UseGuards,
} from '@nestjs/common';
import { OwnerOnlyGuard } from '../guards';
import { CreateTradeHistoryResponse } from '../types';
import { CreateTradeHistoryDto, UpdateTradeHistoryDto } from './dto';
import { TradeHistoryService } from './trade-history.service';

@Controller('trade-history')
export class TradeHistoryController {
   constructor(private readonly tradeHistoryService: TradeHistoryService) {}

   @UseGuards(OwnerOnlyGuard)
   @Post('/trade/:id')
   async create(
      @Param('id') tradeId: string,
      @Body() addTradeHistoryDto: CreateTradeHistoryDto,
   ): Promise<CreateTradeHistoryResponse> {
      return await this.tradeHistoryService.create(addTradeHistoryDto, tradeId);
   }

   @UseGuards(OwnerOnlyGuard)
   @Patch('/trade/:id')
   async update(
      @Param('id') tradeId: string,
      @Body() updateTradeHistoryDto: UpdateTradeHistoryDto,
   ): Promise<any> {
      return await this.tradeHistoryService.update(
         tradeId,
         updateTradeHistoryDto,
      );
   }
}
