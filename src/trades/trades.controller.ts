import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
} from '@nestjs/common';
import { CreateTradeDto } from './dto';
import { TradesService } from './trades.service';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades/trade.responses';
import { UpdateTradeDto } from './dto';
import { User } from '../users/entities/user.entity';
import { UserObject } from '../decorators/user-object.decorator';
import { ValidateUserEnsPipe } from '../pipes/validate-user-ens.pipe';
import { AttachIconToTradePipe } from '../pipes/attach-icon-to-trade.pipe';

@Controller('trades')
export class TradesController {
   constructor(
      private readonly tradesService: TradesService,
   ) {}
   /*This route will be changed. User object will be assigned by `@UserObject()` decorator
   by user's id passed in token. Then 'user/userId' path won't be needed anymore.*/
   @Post('/user/:userId')
   create(
      @Body(AttachIconToTradePipe) createTradeDto: CreateTradeDto,
      @UserObject(ValidateUserEnsPipe) user: User,
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create({ ...createTradeDto, user });
   }

   @Get('/')
   getAll(): Promise<GetAllTradesResponse> {
      return this.tradesService.getAll();
   }

   @Get('/:id')
   getById(@Param('id') id: string): Promise<GetTradeByIdResponse> {
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
}
