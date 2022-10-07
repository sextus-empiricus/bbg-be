import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult, SelectQueryBuilder } from 'typeorm';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllMyResponse,
   GetAllTradesResponse,
   GetPaginationDataResult,
   GetTradeByIdResponse,
   TradeMinified,
   UpdatedTradeResponse,
} from '../types';
import { UsersService } from '../users/users.service';
import { stringToBoolean } from '../utils';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { GetAllMyActiveQueryDto } from './dto/get-all-my-active-query.dto';
import { Trade } from './entities';
import { outputFilterTrades } from './utils/outputFilter-trades';

@Injectable()
export class TradesService {
   constructor(
      @Inject(DataSource) private dataSource: DataSource,
      @Inject(UsersService) private usersService: UsersService,
   ) {}

   async create(
      dto: CreateTradeDto,
      userId: string,
   ): Promise<CreateTradeResponse> {
      const { user } = await this.usersService.getById(userId);
      if (!user) {
         throw new ConflictException('No user found matches provided id.');
      }
      const insertResult: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(Trade)
         .values({ ...dto, user })
         .execute();
      return {
         createdTradeId: insertResult.identifiers[0].id,
      };
   }

   async getAllMy(
      userId: string,
      query: GetAllMyActiveQueryDto,
   ): Promise<GetAllMyResponse> {
      let dbQuery: SelectQueryBuilder<Trade> = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
         .where({
            inExchange: query.historical
               ? !stringToBoolean(query.historical)
               : true,
            user: { id: userId },
         })
         .orderBy('boughtAt', 'DESC');

      //SORT-ORDER:
      if (query.sortBy || query.order) {
         dbQuery = dbQuery.orderBy(
            query.sortBy ? query.sortBy : 'boughtAt',
            query.order ? (query.order.toUpperCase() as any) : 'ASC',
         );
      }
      //FILTER:
      if (query.currency) {
         const { currency } = query;
         dbQuery = dbQuery.andWhere({ currency });
      }
      if (query.from || query.to) {
         const from = new Date('2022-06-01');
         const to = new Date('2022-07-01');
         dbQuery = dbQuery.andWhere('boughtAt BETWEEN :from AND :to', {
            from: from ?? new Date('2000-01-01'),
            to: to ?? new Date(),
         });
      }
      //PAGINATION:
      const { count, limit, offset, pages, page } =
         await this.getPaginationData(query, dbQuery);
      dbQuery.limit(limit).offset(offset);

      return {
         results: count,
         pages,
         page,
         tradesList: outputFilterTrades(await dbQuery.getMany()),
      };
   }

   async getAll(): Promise<GetAllTradesResponse> {
      const tradesList = await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
         .getMany();
      return {
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
         trade: outputFilterTrades(trade)[0] as TradeMinified,
      };
   }

   async update(
      tradeId: string,
      updateTradeDto: UpdateTradeDto,
   ): Promise<UpdatedTradeResponse> {
      await this.dataSource
         .createQueryBuilder()
         .update(Trade)
         .set(updateTradeDto)
         .where({ id: tradeId })
         .execute();
      return {
         updatedTradeId: tradeId,
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
         deletedTradeId: id,
      };
   }

   //utility fns():
   private async getPaginationData(
      query: any,
      dbQuery: SelectQueryBuilder<any>,
   ): Promise<GetPaginationDataResult> {
      const count = await dbQuery.getCount();
      const limit = query.limit ? +query.limit : 10;
      const pages = Math.ceil(count / limit);
      let page = query.page ? +query.page : 1;
      if (query.page <= 1) page = 1;
      if (query.page >= pages) page = pages;
      const offset = (page - 1) * limit;
      return { count, limit, offset, pages, page };
   }
}
