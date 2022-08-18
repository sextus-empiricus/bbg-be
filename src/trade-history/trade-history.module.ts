import { Module } from '@nestjs/common';
import { TradeHistoryService } from './trade-history.service';
import { TradeHistoryController } from './trade-history.controller';

@Module({
  controllers: [TradeHistoryController],
  providers: [TradeHistoryService]
})
export class TradeHistoryModule {}
