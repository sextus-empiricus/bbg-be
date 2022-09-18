import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query, UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { OwnerOnlyGuard } from '../guards';
import { AttachIconToTradePipe } from '../pipes/attach-icon-to-trade.pipe';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types/trades';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { GetAllMyActiveQueryDto } from './dto/get-all-my-active-query.dto';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
   constructor(private readonly tradesService: TradesService) {}

   @Post('/')
   create(
      @Body(AttachIconToTradePipe) createTradeDto: CreateTradeDto,
      @GetCurrentUser('sub') id: string,
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create(createTradeDto, id);
   }

   @Get('/my')
   async getAllMy(
      @GetCurrentUser('sub') id: string,
      @Query() query: GetAllMyActiveQueryDto,
   ) {
      return await this.tradesService.getAllMy(id, query);
   }

   @UseGuards(OwnerOnlyGuard)
   @Patch('/my/:id')
   updateMy(
      @Param('id') tradeId: string,
      @GetCurrentUser('sub') userId: string,
      @Body() updateTradeDto: UpdateTradeDto,
   ): Promise<UpdatedTradeResponse> {
      return this.tradesService.update(tradeId, updateTradeDto);
   }

   @UseGuards(OwnerOnlyGuard)
   @Delete('/my/:id')
   async removeMy(
      @Param('id') tradeId: string,
      @GetCurrentUser('sub') userId: string,
   ): Promise<DeleteTradeByIdResponse> {
      return await this.tradesService.remove(tradeId);
   }
}
