import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Trade } from '../entities/trade.entity';

export class AddTradeHistoryDto {
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
   trade?: Trade
}

