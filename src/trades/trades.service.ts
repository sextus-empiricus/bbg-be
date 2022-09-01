import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api/response';
import { Trade } from './entities/trade.entity';
import { User } from '../users/entities/user.entity';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { CreateTradeDtoInterface } from '../types/trades/dto/create-trade-dto.interface';
import { TradeMinified } from '../types/trades/trade.interface';
import { UpdateTradeDto } from './dto';

interface CreateTradeData extends CreateTradeDtoInterface {
   user: User;
}

@Injectable()
export class TradesService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}
   /*ℹThis filter cleans dry db fetched data and removes all unusefull rows for client (as `createdAt` etc.).*/
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
            let iconUrl = null;
            if (el.tradeHistory) {
               const { createdAt, updatedAt, ...tradeHistoryMini } =
                  el.tradeHistory;
               tradeHistory = tradeHistoryMini;
            }
            if (el.iconUrl) {
               const { url } = el.iconUrl;
               iconUrl = url;
            }
            const { createdAt, updatedAt, ...trade } = el;
            return { ...trade, tradeHistory, iconUrl };
         });
      }
      /*If trades is a signle `Trade` object:*/
      const { createdAt, updatedAt, ...trade } = trades;
      let tradeHistory = null;
      let iconUrl = null;
      if (trade.tradeHistory) {
         const { createdAt, updatedAt, ...tradeHistoryMini } =
            trade.tradeHistory;
         tradeHistory = tradeHistoryMini;
      }
      if (trade.iconUrl) {
         const { url } = trade.iconUrl;
         iconUrl = url;
      }
      return {
         ...trade,
         tradeHistory,
         iconUrl,
      };
   }

   async create(data: CreateTradeData): Promise<CreateTradeResponse> {
      //🚨here should be implemented logic of curr-icon fetching
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
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
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
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
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
}
