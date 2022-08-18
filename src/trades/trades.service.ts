import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api/response';
import { Trade } from './entities/trade.entity';
import { User } from '../users/entities/user.entity';
import {
   CreateTradeResponse, DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { CreateTradeDtoInterface } from '../types/trades/dto/create-trade-dto.interface';
import { TradeMinified } from '../types/trades/trade.interface';
import { UpdateTradeDto } from './dto';
import { AddTradeHistoryDto } from './dto/add-trade-history.dto';
import { TradeHistory } from './entities/trade-history.entity';
import { CreateTradeHistoryResponse } from '../types/trades/trade-history.responses';

interface CreateTradeData extends CreateTradeDtoInterface {
   user: User;
}

@Injectable()
export class TradesService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   private outputFilter(
      trades: Trade[] | Trade | null,
   ): TradeMinified[] | TradeMinified | null {
      /*If `trades` is a null*/
      if (trades === null) {
         return null;
      }
      /*If `trades` is an array:*/
      if (Array.isArray(trades)) {
         return trades.map((el) => {
            let tradeHistory = null;
            if (el.tradeHistory) {
               const { createdAt, updatedAt, ...tradeHistoryMini } =
                  el.tradeHistory;
               tradeHistory = tradeHistoryMini;
            }
            const { createdAt, updatedAt, ...trade } = el;
            return { ...trade, tradeHistory };
         });
      }
      /*If trades is a signle `Trade` object:*/
      const { createdAt, updatedAt, ...trade } = trades;
      let tradeHistory = null;
      if (trade.tradeHistory) {
         const { createdAt, updatedAt, ...tradeHistoryMini } =
            trade.tradeHistory;
         tradeHistory = tradeHistoryMini;
      }
      return {
         ...trade,
         tradeHistory,
      };
   }

   async create(data: CreateTradeData): Promise<CreateTradeResponse> {
      const insertResult: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(Trade)
         .values(data)
         .execute();
      return {
         status: ResponseStatus.success,
         createdTradeId: insertResult.identifiers[0].id,
      };
   }

   async getAll(): Promise<GetAllTradesResponse> {
      const tradesList = await this.dataSource
         .getRepository(Trade)
         .createQueryBuilder('trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .getMany();
      return {
         status: ResponseStatus.success,
         tradesList: this.outputFilter(tradesList),
      };
   }

   async getById(id: string): Promise<GetTradeByIdResponse> {
      const trade = await this.dataSource
         .getRepository(Trade)
         .createQueryBuilder('trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .where('trade.id = :id', { id })
         .getOne();

      return {
         status: ResponseStatus.success,
         trade: this.outputFilter(trade) as TradeMinified,
      };
   }

   async update(
      id: string,
      updateTradeDto: UpdateTradeDto,
   ): Promise<UpdatedTradeResponse> {
      await this.dataSource
         .createQueryBuilder()
         .update(Trade)
         .set(updateTradeDto)
         .where({ id })
         .execute();
      return {
         status: ResponseStatus.success,
         updatedTradeId: id,
      };
   }

   async remove(id: string): Promise<DeleteTradeByIdResponse> {
      await this.dataSource
         .createQueryBuilder()
         .delete()
         .from(Trade)
         .where({ id })
         .execute();
      return {
         status: ResponseStatus.success,
         deletedTradeId: id,
      };
   }
   /*TRADE-HISTORY ACTIONS:*/
   async createTradeHistory(
      addTradeHistoryDto: AddTradeHistoryDto,
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
