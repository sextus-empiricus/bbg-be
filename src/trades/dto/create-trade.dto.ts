import { CreateTradeDtoInterface } from '../../types/trades/dto/create-trade-dto.interface';
import {
   IsDate,
   IsNumber,
   IsOptional,
   IsPositive,
   IsString,
} from 'class-validator';

export class CreateTradeDto implements CreateTradeDtoInterface {
   @IsString()
   currency: string;

   @IsNumber()
   @IsPositive()
   boughtFor: number;

   @IsNumber()
   @IsPositive()
   price: number;

   @IsNumber()
   @IsPositive()
   amount: number;

   @IsString()
   @IsOptional()
   boughtAt: string;
}