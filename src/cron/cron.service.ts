import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CronService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   @Cron(CronExpression.EVERY_WEEK)
   async deleteDeactivatedUsers() {
      const deactivatedUsers = await this.dataSource
         .createQueryBuilder()
         .select()
         .select('user')
         .from(User, 'user')
         .where({ isActive: false })
         .getMany();

      deactivatedUsers.map(async (el) => {
         await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(User)
            .where({ id: el.id })
            .execute();
      });
      console.log('CRON - deactivated users deleted from database.');
   }
}
