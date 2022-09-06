import { Controller, Post, Body, Param } from '@nestjs/common';
import { CreateTradeHistoryDto } from './dto/create-trade-history.dto';
import { CreateTradeHistoryResponse } from '../types/trade-history/trade-history.responses';
import { TradeHistoryService } from './trade-history.service';

@Controller('trade-history')
export class TradeHistoryController {
   constructor(private readonly tradeHistoryService: TradeHistoryService) {}

   @Post('/trade/:tradeId')
   async create(
      @Param('tradeId') tradeId: string,
      @Body() addTradeHistoryDto: CreateTradeHistoryDto,
   ): Promise<CreateTradeHistoryResponse> {
      return await this.tradeHistoryService.create(addTradeHistoryDto, tradeId);
   }

   // @Get()
   // findAll() {
   //   return this.tradeHistoryService.findAll();
   // }
   //
   // @Get(':id')
   // findOne(@Param('id') id: string) {
   //   return this.tradeHistoryService.findOne(+id);
   // }
   //
   // @Patch(':id')
   // update(@Param('id') id: string, @Body() updateTradeHistoryDto: UpdateTradeHistoryDto) {
   //   return this.tradeHistoryService.update(+id, updateTradeHistoryDto);
   // }
   //
   // @Delete(':id')
   // remove(@Param('id') id: string) {
   //   return this.tradeHistoryService.remove(+id);
   // }
}
