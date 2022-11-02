import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Trade } from '../trades/entities';

/**Guard check relation of loggedin user and the trade he wants to impact. If the trade belogns to another user it throws a `ForbiddenException`.*/
@Injectable()
export class OwnerOnlyGuard implements CanActivate {
   constructor(private dataSource: DataSource) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      await this.checkOwnership(request.params.id, request.user.sub);
      return true;
   }

   async checkOwnership(tradeId: string, userId: string): Promise<void> {
      const trade = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.user', 'user')
         .where('trade.id = :id', { id: tradeId })
         .getOne();
      if (!trade?.user || trade?.user?.id !== userId)
         throw new ForbiddenException(
            'Can not impact on trade of another user.',
         );
   }
}