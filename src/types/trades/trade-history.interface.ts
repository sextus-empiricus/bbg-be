import { Trade } from '../../trades/entities/trade.entity';

export interface TradeHistoryInterface {
   id: string;
   soldAt: Date;
   soldFor: number;
   price: number;
   profitPerc: number;
   profitCash: number;
   updatedAt: Date;
   createdAt: Date;
   trade: Trade;
}

export type TradeHistoryMinfied = Omit<
   TradeHistoryInterface,
   'trade' | 'createdAt' | 'updatedAt'
>;
