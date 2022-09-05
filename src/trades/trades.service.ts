import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api/response';
import { Trade } from './entities/trade.entity';
import { TradeMinified } from '../types/trades/trade.interface';
import { UsersService } from '../users/users.service';
import { outputFilter } from './utils/outputFilter';

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
         tradesList: outputFilter(tradesList),
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
         trade: outputFilter(trade)[0] as TradeMinified,
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
