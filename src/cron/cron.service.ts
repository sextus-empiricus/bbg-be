import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { TradeHistory } from '../trade-history/entities/trade-history.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CronService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   @Cron(CronExpression.EVERY_WEEK)
   async deleteDeactivatedUsers() {
      const deactivatedUsers: User[] = await this.dataSource
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

   /*This function cleans database from unusefull `TradeHistory` records which are no realted to any `Trade` record.*/
   @Cron(CronExpression.EVERY_WEEK)
   async deleteUnrelatedTradeHistoryRecords() {
      const unrelatedTradeHistoryRecords = await this.dataSource
         .getRepository(TradeHistory)
         .createQueryBuilder('tradeHistory')
         .leftJoinAndSelect('tradeHistory.trade', 'trade')
         .getMany();

      unrelatedTradeHistoryRecords.map(async (el) => {
         if (el.trade === null) {
            await this.dataSource
               .createQueryBuilder()
               .delete()
               .from(TradeHistory)
               .where({ id: el.id })
               .execute();
         }
      });
   }
}
