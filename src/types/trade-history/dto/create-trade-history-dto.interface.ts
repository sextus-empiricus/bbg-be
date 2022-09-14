import { Trade } from '../../../trades/entities';

export interface CreateTradeHistoryDtoInterface {
   soldAt: string;
   soldFor: number;
   price: number;
   profitPerc: number;
   profitCash: number;
   trade?: Trade;
}
