import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api/response';
import { Trade } from './entities/trade.entity';
import { User } from '../users/entities/user.entity';
import {
   CreateTradeResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { CreateTradeDtoInterface } from '../types/trades/dto/create-trade-dto.interface';
import { TradeMinified } from '../types/trades/trade';
import { UpdateTradeDto } from './dto';

interface CreateTradeData extends CreateTradeDtoInterface {
   user: User;
}

@Injectable()
export class TradesService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   private outputFilter(trades: Trade[]): TradeMinified[] {
      return trades.map((el) => {
         return {
            id: el.id,
            currency: el.currency,
            boughtAt: el.boughtAt,
            boughtFor: el.boughtFor,
            price: el.price,
            amount: el.amount,
            inExchange: el.inExchange,
         };
      });
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
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .getMany();
      return {
         status: ResponseStatus.success,
         tradesList: this.outputFilter(tradesList),
      };
   }

   async getById(id: string): Promise<GetTradeByIdResponse> {
      const trade = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .where({ id })
         .getOne();
      return {
         status: ResponseStatus.success,
         trade: this.outputFilter([trade])[0],
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

   async remove(id: string) {
      await this.dataSource
         .createQueryBuilder()
         .delete()
         .from(Trade)
         .where({ id })
         .execute();
   }
}
