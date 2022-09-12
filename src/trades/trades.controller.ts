import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
} from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
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

   @Post('/')
   create(
      @Body(AttachIconToTradePipe) createTradeDto: CreateTradeDto,
      @GetCurrentUser('sub') id: string,
   ): Promise<CreateTradeResponse> {
      return this.tradesService.create(createTradeDto, id);
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
