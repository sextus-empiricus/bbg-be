import { CreateTradeHistoryDto } from './dto/create-trade-history.dto';
import { CreateTradeHistoryResponse } from '../types/trade-history/trade-history.responses';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseStatus } from '../types/api/response';
import { Trade } from '../trades/entities/trade.entity';
import { TradeHistory } from './entities/trade-history.entity';

@Injectable()
export class TradeHistoryService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   async create(
      addTradeHistoryDto: CreateTradeHistoryDto,
   ): Promise<CreateTradeHistoryResponse> {
      /*🚨Part of following function logic of simple queries which uses `Query Builder` can be shortened:
      1. const createdTradeHistory = TradeHistory.findeOneBy({id: tradeHistoryId}) (-5 lines),
      2. relating tradeHistory to trade:
            trade.inExchange = false;
            trade.tradeHistory = createdTradeHistory;
            await trade.save();
            (-6 lines)
      But I heard from more experiences developers it's better to follow one way of quering db witch `TypeOrm`
      in all application. Secondly found some problems which service tests logic when it mixes `Query Builder`
      and `Active Record`.*/
      const { id: tradeId } = addTradeHistoryDto.trade;
      const { id: tradeHistoryId } = (
         await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(TradeHistory)
            .values(addTradeHistoryDto)
            .execute()
      ).identifiers[0];

      const createdTradeHistory: TradeHistory = await this.dataSource
         .createQueryBuilder()
         .select('tradeHistory')
         .from(TradeHistory, 'tradeHistory')
         .where({ id: tradeHistoryId })
         .getOne();

      await this.dataSource
         .createQueryBuilder()
         .update(Trade)
         .set({
            inExchange: false,
            tradeHistory: createdTradeHistory,
         })
         .where({ id: tradeId })
         .execute();

      return {
         status: ResponseStatus.success,
         createdTradeHistoryId: tradeHistoryId,
         relatedTradeId: tradeId,
      };
   }
}
