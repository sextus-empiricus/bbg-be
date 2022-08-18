import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
} from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { AddTradeHistoryDto } from './dto/add-trade-history.dto';
import { Trade } from './entities/trade.entity';
import { TradeObject } from '../decorators/trade-object-from-param.decorator';
import { UpdateTradeDto } from './dto';
import { User } from '../users/entities/user.entity';
import { UserObject } from '../decorators/user-object.decorator';
import { ValidateUserEnsPipe } from '../pipes/validate-user-ens.pipe';
import { CreateTradeHistoryResponse } from '../types/trades/trade-history.responses';

@Controller('trades')
export class TradesController {
   constructor(private readonly tradesService: TradesService) {}

   /*This route will be changed. User object will be assigned by `@UserObject()` decorator
   by user's id passed in token. Then 'user/userId' path won't be needed anymore. */
   @Post('/user/:userId')
   create(
      @Body() createTradeDto: CreateTradeDto,
      @UserObject(ValidateUserEnsPipe) user: User,
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create({ ...createTradeDto, user });
   }

   @Get('/')
   getAll(): Promise<GetAllTradesResponse> {
      return this.tradesService.getAll();
   }

   @Get('/:id')
   getOneById(@Param('id') id: string): Promise<GetTradeByIdResponse> {
      return this.tradesService.getById(id);
   }

   @Patch('/:id')
   update(
      @Param('id') id: string,
      @Body() updateTradeDto: UpdateTradeDto,
   ): Promise<UpdatedTradeResponse> {
      return this.tradesService.update(id, updateTradeDto);
   }

   @Delete('/:id')
   async remove(@Param('id') id: string): Promise<DeleteTradeByIdResponse> {
      return await this.tradesService.remove(id);
   }

   /*TRADE-HISTORY CONTROLLERS:*/
   @Post('/trade-history/:tradeId')
   async createTradeHistory(
      @TradeObject() trade: Trade,
      @Body() addTradeHistoryDto: AddTradeHistoryDto,
   ): Promise<CreateTradeHistoryResponse> {
      return await this.tradesService.createTradeHistory({
         ...addTradeHistoryDto,
         trade,
      });
   }
}
