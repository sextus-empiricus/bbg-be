import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { appConfig } from '../../config/app-config';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';

const { development } = appConfig.app;

@Injectable()
export class CronService {
   constructor(@Inject(UsersService) private usersService: UsersService) {
   }

   /**ℹThis fn() removes every day disactivated users if after its deactivating passed one week.
    * In development environment it runs every minute and delete if passed one minute.*/
   @Cron(development ? CronExpression.EVERY_MINUTE : CronExpression.EVERY_DAY_AT_1AM)
   async deleteDeactivatedUsers() {
      //Set contants:
      const now = new Date();
      const nowTime = now.toLocaleTimeString();
      const experationTime = development ? 1000 * 60 : 1000 * 60 * 60 * 24 * 7;
      const runTime = development ? CronExpression.EVERY_MINUTE : CronExpression.EVERY_DAY_AT_1AM;

      //Print run info in console:
      console.log(`${nowTime}: CRON \`deleteDeactivatedUsers\` - RUNNED`);
      // Get all deactivater users:
      const deactivatedUsers: User[] = await this.usersService.getAllDisabled();
      // Delete all deactivated users if was deactivated before 1 week:
      deactivatedUsers.map(async (el) => {
         const updatedAt = new Date(Date.parse(el.updatedAt.toString()));
         if (Number(now) - Number(updatedAt) > experationTime) {
            console.log(`${nowTime}: ${el.id} - user deleted from data base`);
            await this.usersService.removeById(el.id);
         }
      });
   }
}
