import { CreateTradeHistoryDto } from './dto/create-trade-history.dto';
import { CreateTradeHistoryResponse } from '../types/trade-history/trade-history.responses';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseStatus } from '../types/api/response';
import { TradeHistory } from './entities/trade-history.entity';

@Injectable()
export class TradeHistoryService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   async create(
      addTradeHistoryDto: CreateTradeHistoryDto,
   ): Promise<CreateTradeHistoryResponse> {
      const { trade } = addTradeHistoryDto;
      const { id } = (
         await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(TradeHistory)
            .values(addTradeHistoryDto)
            .execute()
      ).identifiers[0];
      trade.inExchange = false;
      trade.tradeHistory = await TradeHistory.findOneBy({ id });
      await trade.save();
      return {
         status: ResponseStatus.success,
         createdTradeHistoryId: id,
         relatedTradeId: trade.id,
      };
   }
}
