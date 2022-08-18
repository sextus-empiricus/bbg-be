import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Trade } from '../trades/entities/trade.entity';

export const TradeObject = createParamDecorator(
   async (data: any, ctx: ExecutionContext): Promise<Trade> => {
      const request = ctx.switchToHttp().getRequest();
      const id = request.params.tradeId;
      return await Trade.findOne({ where: { id } });
   },
);
