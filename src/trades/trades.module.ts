import { Module } from '@nestjs/common';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { IconUrlModule } from '../icon-url/icon-url.module';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
   imports: [IconUrlModule, HttpModule, UsersModule],
   controllers: [TradesController],
   providers: [TradesService],
   exports: [TradesService],
})
export class TradesModule {}
