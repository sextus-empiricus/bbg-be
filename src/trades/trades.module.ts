import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IconUrlModule } from '../icon-url/icon-url.module';
import { UsersModule } from '../users/users.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
   imports: [IconUrlModule, HttpModule, UsersModule],
   controllers: [TradesController],
   providers: [TradesService],
   exports: [TradesService],
})
export class TradesModule {}
