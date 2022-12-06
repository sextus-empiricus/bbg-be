import { IsNumber, IsPositive, IsString } from 'class-validator';
import { TradeHistory } from '../../trade-history/entities';
import { CreateTradeDtoInterface, IconUrlInterface } from '../../types';

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

   iconUrl?: IconUrlInterface;

   /*For update-dto:*/
   inExchange?: boolean;
   tradeHistory?: TradeHistory;
}
