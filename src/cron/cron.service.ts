import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { convertToNumber as N } from '../utils/convert-data-helpers';

@Injectable()
export class CronService {
   constructor(@Inject(UsersService) private usersService: UsersService) {}

   /**ℹThis fn() removes every day disactivated users if after its deactivating passed one week.*/
   @Cron(CronExpression.EVERY_10_SECONDS)
   async deleteDeactivatedUsers() {
      const now = new Date();
      const nowTime = now.toLocaleTimeString();
      console.log(`${nowTime}: CRON \`deleteDeactivatedUsers\` - RUNNED`);
      const deactivatedUsers: User[] = await this.usersService.getAllDisabled();
      deactivatedUsers.map(async (el) => {
         let updatedAt = new Date(Date.parse(el.updatedAt.toString()));
         const oneMinute = 1000 * 60;
         if (N(now) - N(updatedAt) > oneMinute) {
            console.log(`${nowTime}: ${el.id} - user deleted from data base`);
            await this.usersService.removeById(el.id);
         }
      });
   }
}
