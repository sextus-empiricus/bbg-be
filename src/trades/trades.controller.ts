import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
} from '@nestjs/common';
import { AttachIconToTradePipe } from '../pipes/attach-icon-to-trade.pipe';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetAllTradesResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
   constructor(private readonly tradesService: TradesService) {}

   /*💡This route will be changed after auth logic implement. User object will be assigned by `@UserObject()`
    * decorator by user's id passed in token. Then 'user/userId' path won't be needed anymore.*/
   @Post('/user/:userId')
   create(
      @Body(AttachIconToTradePipe) createTradeDto: CreateTradeDto,
      @Param('userId') userId: string,
      // @UserObject(ValidateUserEnsPipe) user: User, || 🔍 comments in @UserObject() decor.
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create(createTradeDto, userId);
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
