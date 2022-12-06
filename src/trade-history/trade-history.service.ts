import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TradesService } from '../trades/trades.service';
import {
   CreateTradeHistoryResponse,
   ResponseStatus,
   UpdateTradeHistoryResponse,
} from '../types';
import { CreateTradeHistoryDto, UpdateTradeHistoryDto } from './dto';
import { TradeHistory } from './entities';

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

   async update(
      tradeId: string,
      dto: UpdateTradeHistoryDto,
   ): Promise<UpdateTradeHistoryResponse> {
      const {
         trade: {
            tradeHistory: { id: tradeHistoryId },
         },
      } = await this.tradesService.getById(tradeId);
      await this.dataSource
         .createQueryBuilder()
         .update(TradeHistory)
         .set(dto)
         .where({ id: tradeHistoryId })
         .execute();
      return {
         status: ResponseStatus.success,
         updatedTradeHistoryId: tradeHistoryId,
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
