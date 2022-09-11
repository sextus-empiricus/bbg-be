import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   TradeMinified,
   UpdatedTradeResponse,
} from '../types/trades';
import { UsersService } from '../users/users.service';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { Trade } from './entities';
import { outputFilterTrades } from './utils/outputFilter-trades';

@Injectable()
export class TradesService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      @Inject(UsersService) private usersService: UsersService,
   ) {
   }

   async create(
      dto: CreateTradeDto,
      userId: string,
   ): Promise<CreateTradeResponse> {
      const { user } = await this.usersService.getById(userId);
      if (user === null) {
         throw new ConflictException('No user found matches provided id.');
      }
      const insertResult: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(Trade)
         .values({ ...dto, user })
         .execute();
      return {
         status: ResponseStatus.success,
         createdTradeId: insertResult.identifiers[0].id,
      };
   }

   /*💡DIFFERENT APPROACH EXAMPLE:
      async getAll(): Promise<GetAllTradesResponse> {
         const tradesList = await this.dataSource
            .getRepository(Trade)
            .createQueryBuilder('trade')
            .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
            .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
            .getMany();
         return {
            status: ResponseStatus.success,
            tradesList: outputFilter(tradesList),
         };
      }
   */
   async getAll(): Promise<GetAllTradesResponse> {
      const tradesList = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
         .getMany();
      return {
         status: ResponseStatus.success,
         tradesList: outputFilterTrades(tradesList),
      };
   }

   async getById(id: string): Promise<GetTradeByIdResponse> {
      const trade = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
         .where('trade.id = :id', { id })
         .getOne();
      return {
         status: ResponseStatus.success,
         trade: outputFilterTrades(trade)[0] as TradeMinified,
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
