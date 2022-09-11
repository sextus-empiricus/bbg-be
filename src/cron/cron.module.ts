import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { CronService } from './cron.service';

@Module({
   imports: [ScheduleModule.forRoot(), UsersModule],
   providers: [CronService],
})
export class CronModule {}
