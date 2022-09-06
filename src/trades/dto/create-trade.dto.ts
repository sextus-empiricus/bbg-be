import { CreateTradeDtoInterface } from '../../types/trades/dto/create-trade-dto.interface';
import {
   IsNumber,
   IsPositive,
   IsString,
} from 'class-validator';
import { TradeHistory } from '../../trade-history/entities/trade-history.entity';

export class CreateTradeDto implements CreateTradeDtoInterface {
   @IsString()
   currency: string;

   @IsString()
   boughtAt: string;

   @IsNumber()
   @IsPositive()
   boughtFor: number;

   @IsNumber()
   @IsPositive()
   price: number;

   @IsNumber()
   @IsPositive()
   amount: number;

   /*For update-dto:*/
   inExchange?: boolean;
   tradeHistory?: TradeHistory;
}
