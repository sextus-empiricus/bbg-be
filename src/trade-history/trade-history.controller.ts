import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { OwnerOnlyGuard } from '../guards';
import { CreateTradeHistoryResponse } from '../types/trade-history';
import { CreateTradeHistoryDto } from './dto';
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
}
