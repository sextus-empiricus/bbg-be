import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Trade } from '../../trades/entities';
import { CreateTradeHistoryDtoInterface } from '../../types/trade-history';

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
