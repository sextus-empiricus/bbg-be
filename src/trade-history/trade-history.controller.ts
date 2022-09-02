import { Controller, Post, Body, } from '@nestjs/common';
import { CreateTradeHistoryDto } from './dto/create-trade-history.dto';
import { CreateTradeHistoryResponse } from '../types/trade-history/trade-history.responses';
import { Trade } from '../trades/entities/trade.entity';
import { TradeHistoryService } from './trade-history.service';
import { TradeObject } from '../decorators/trade-object-from-param.decorator';

@Controller('trade-history')
export class TradeHistoryController {
  constructor(private readonly tradeHistoryService: TradeHistoryService) {}

  /*TRADE-HISTORY CONTROLLERS:*/
  @Post('/trade/:tradeId')
  async create(
     @TradeObject() trade: Trade,
     @Body() addTradeHistoryDto: CreateTradeHistoryDto,
  ): Promise<CreateTradeHistoryResponse> {
    return await this.tradeHistoryService.create({
      ...addTradeHistoryDto,
      trade,
    });
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
