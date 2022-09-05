import { Module } from '@nestjs/common';
import { TradeHistoryService } from './trade-history.service';
import { TradeHistoryController } from './trade-history.controller';
import { TradesModule } from '../trades/trades.module';

@Module({
   imports: [TradesModule],
   controllers: [TradeHistoryController],
   providers: [TradeHistoryService],
})
export class TradeHistoryModule {
}
