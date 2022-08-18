import {
   ConflictException,
   ExecutionContext,
   createParamDecorator,
} from '@nestjs/common';
import { Trade } from '../trades/entities/trade.entity';

export const TradeObject = createParamDecorator(
   async (data: any, ctx: ExecutionContext): Promise<Trade> => {
      const request = ctx.switchToHttp().getRequest();
      const id = request.params.tradeId;
      const targetTrade = await Trade.findOne({ where: { id } });
      if (!targetTrade) {
         throw new ConflictException('No trade found matches provided id.');
      }
      return targetTrade;
   },
);
