import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { OwnerOnlyGuard } from '../guards';
import { AttachIconToTradePipe } from '../pipes/attach-icon-to-trade.pipe';
import {
   CreateTradeResponse,
   DeleteTradeByIdResponse,
   GetMyPaginatedResponse,
   GetTradeByIdResponse,
   UpdatedTradeResponse,
} from '../types';
import { CreateTradeDto, UpdateTradeDto } from './dto';
import { GetMyPaginatedQuery } from './dto/get-my-paginated.query';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
   constructor(private readonly tradesService: TradesService) {}

   @Post('/')
   async create(
      @Body(AttachIconToTradePipe) createTradeDto: CreateTradeDto,
      @GetCurrentUser('sub') id: string,
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create(createTradeDto, id);
   }

   @Get('/my')
   async getMyPaginated(
      @GetCurrentUser('sub') id: string,
      @Query() query: GetMyPaginatedQuery,
   ): Promise<GetMyPaginatedResponse> {
      return await this.tradesService.getMyPaginated(id, query);
   }

   @UseGuards(OwnerOnlyGuard)
   @Get('/my/:id')
   async getMyById(
      @Param('id') tradeId: string,
      @GetCurrentUser('sub') userId: string,
   ): Promise<GetTradeByIdResponse> {
      return this.tradesService.getById(tradeId);
   }

   @UseGuards(OwnerOnlyGuard)
   @Patch('/my/:id')
   async updateMy(
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