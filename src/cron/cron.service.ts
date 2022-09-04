import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { TradeHistory } from '../trade-history/entities/trade-history.entity';
import { User } from '../users/entities/user.entity';
import { Trade } from '../trades/entities/trade.entity';

@Injectable()
export class CronService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   /*This fn() removes disactivated users every day.
   💡TODO Make it better! Check if user.!isActive and if from now to user.updatedAt pass 7 days.
   */
   @Cron(CronExpression.EVERY_DAY_AT_1AM)
   async deleteDeactivatedUsers() {
      const deactivatedUsers: User[] = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ isActive: false })
         .getMany();

      deactivatedUsers.map(async (el) => {
         await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(User, 'user')
            .where({ id: el.id })
            .execute();
      });
      console.log('CRON - deactivated users deleted from database.');
   }

   /*This fn() cleans database from unusefull `TradeHistory` records which are no realted to any `Trade` record if exists..*/
   @Cron(CronExpression.EVERY_10_SECONDS)
   async deleteUnrelatedTradeHistoryRecords() {
      const tradeHistoryRecords = await this.dataSource
         .createQueryBuilder()
         .select('tradeHistory')
         .from(TradeHistory, 'tradeHistory')
         .leftJoinAndSelect('tradeHistory.trade', 'trade')
         //🤔 can't achieve tradeHistory.trade. maybe because trade is a dominant side of rel;
         .getMany();

      tradeHistoryRecords.map(async (el) => {
         if (el.trade === null) {
            await this.dataSource
               .createQueryBuilder()
               .delete()
               .from(TradeHistory, 'tradeHistory')
               .where({ id: el.id })
               .execute();
         }
      });
   }
}
