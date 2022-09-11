import { Module } from '@nestjs/common';
import { TradesModule } from '../trades/trades.module';
import { TradeHistoryController } from './trade-history.controller';
import { TradeHistoryService } from './trade-history.service';

@Module({
   imports: [TradesModule],
   controllers: [TradeHistoryController],
   providers: [TradeHistoryService],
})
export class TradeHistoryModule {}
