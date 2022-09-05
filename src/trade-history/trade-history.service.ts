import { CreateTradeHistoryDto } from './dto/create-trade-history.dto';
import { CreateTradeHistoryResponse } from '../types/trade-history/trade-history.responses';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseStatus } from '../types/api/response';
import { TradeHistory } from './entities/trade-history.entity';
import { TradesService } from '../trades/trades.service';

@Injectable()
export class TradeHistoryService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      @Inject(TradesService) private tradesService: TradesService,
   ) {}

   async create(
      addTradeHistoryDto: CreateTradeHistoryDto,
      tradeId: string,
   ): Promise<CreateTradeHistoryResponse> {

      const { id: tradeHistoryId } = (
         await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(TradeHistory)
            .values(addTradeHistoryDto)
            .execute()
      ).identifiers[0];

      const createdTradeHistory = await this.getById(tradeHistoryId);

      await this.tradesService.update(tradeId, {
         inExchange: false,
         tradeHistory: createdTradeHistory,
      });

      return {
         status: ResponseStatus.success,
         createdTradeHistoryId: tradeHistoryId,
         relatedTradeId: tradeId,
      };
   }

   async getById(id: string): Promise<TradeHistory | null> {
      return await this.dataSource
         .createQueryBuilder()
         .select('tradeHistory')
         .from(TradeHistory, 'tradeHistory')
         .where({ id })
         .getOne();
   }
}
