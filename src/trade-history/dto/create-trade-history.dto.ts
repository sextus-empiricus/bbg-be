import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Trade } from '../../trades/entities/trade.entity';
import { CreateTradeHistoryDtoInterface } from '../../types/trade-history/dto/create-trade-history-dto.interface';

export class CreateTradeHistoryDto implements CreateTradeHistoryDtoInterface {
   @IsString()
   soldAt: string;

   @IsNumber()
   soldFor: number;

   @IsNumber()
   price: number;

   @IsNumber()
   profitPerc: number;

   @IsNumber()
   profitCash: number;

   @IsObject()
   @IsOptional()
   trade?: Trade;
}
