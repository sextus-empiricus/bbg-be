import { Module } from '@nestjs/common';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { IconUrlModule } from '../icon-url/icon-url.module';
import { TradeHistoryModule } from '../trade-history/trade-history.module';
import { TradesModule } from '../trades/trades.module';
import { DummyGeneratorController } from './dummy-generator.controller';
import { DummyGeneratorService } from './dummy-generator.service';

@Module({
   imports: [
      ExternalApisModule,
      TradesModule,
      TradeHistoryModule,
      IconUrlModule,
   ],
   controllers: [DummyGeneratorController],
   providers: [DummyGeneratorService],
})
export class DummyGeneratorModule {}
