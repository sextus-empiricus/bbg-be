import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { IconUrlModule } from '../icon-url/icon-url.module';
import { HttpModule } from '@nestjs/axios';

@Module({
   imports: [IconUrlModule, HttpModule],
   controllers: [TradesController],
   providers: [TradesService],
})
export class TradesModule {}
