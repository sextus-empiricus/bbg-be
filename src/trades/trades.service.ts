import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult, SelectQueryBuilder } from 'typeorm';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetMyPaginatedResponse,
   GetPaginationDataResult,
   GetTradeByIdResponse,
   QuerySortBy,
   UpdatedTradeResponse,
   UserCurrenciesEntity,
} from '../types';
import { UsersService } from '../users/users.service';
import { stringToBoolean } from '../utils';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { GetMyPaginatedQuery } from './dto/get-my-paginated.query';
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

   async getMyPaginated(
      userId: string,
      query: GetMyPaginatedQuery,
   ): Promise<GetMyPaginatedResponse> {
      console.log(query);
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
      if (query.sortBy === 'buyPrice') {
         query.sortBy = 'trade.price' as QuerySortBy;
      }
      if (query.sortBy === 'sellPrice') {
         query.sortBy = 'tradeHistory.price' as QuerySortBy;
      }
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
         const from = query.from
            ? new Date(query.from)
            : new Date('2009-03-01');
         const to = query.to ? new Date(query.to) : new Date();
         dbQuery = dbQuery.andWhere('boughtAt BETWEEN :from AND :to', {
            from,
            to,
         });
      }
      //PAGINATION:
      const { count, limit, offset, pages, page } =
         await this.getPaginationData(query, dbQuery);
      console.log({ offset });
      dbQuery.limit(limit).offset(offset);

      //USER CURRENCIES ARR:
      const historical = query.historical
         ? stringToBoolean(query.historical)
         : false;
      console.log(historical);
      const userCurrencies = await this.getArrayOfUserCurrencies(
         userId,
         historical,
      );

      return {
         results: count,
         pages,
         page,
         userCurrencies,
         tradesList: outputFilterTrades(await dbQuery.getMany()),
      };
   }

   async getMyAll(userId: string, historical: boolean): Promise<Trade[]> {
      return await this.dataSource
         .createQueryBuilder()
         .select('trade')
         .from(Trade, 'trade')
         .leftJoinAndSelect('trade.tradeHistory', 'tradeHistory')
         .leftJoinAndSelect('trade.iconUrl', 'iconUrl')
         .where({
            inExchange: !historical,
            user: { id: userId },
         })
         .getMany();
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
         trade: outputFilterTrades(trade)[0],
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
      let pages = Math.ceil(count / limit);
      if (pages < 1) pages = 1;
      let page = query.page ? +query.page : 1;
      if (query.page <= 1) page = 1;
      if (query.page >= pages) page = pages;
      const offset = (page - 1) * limit;
      console.log({ page, limit, offset });
      return { count, limit, offset, pages, page };
   }

   private async getArrayOfUserCurrencies(
      userId: string,
      historical: boolean,
   ): Promise<UserCurrenciesEntity[]> {
      const userTrades = await this.getMyAll(userId, historical);
      const mappedData = userTrades.map((el) => ({
         currency: el.currency,
         iconUrl: el.iconUrl.url,
      }));
      const filteredData = [];
      mappedData.forEach(function (item) {
         const i = filteredData.findIndex((el) => el.iconUrl == item.iconUrl);
         if (i <= -1) {
            filteredData.push({
               currency: item.currency,
               iconUrl: item.iconUrl,
            });
         }
      });
      return filteredData.sort((a, b) => a.currency.localeCompare(b.currency));
   }
}
