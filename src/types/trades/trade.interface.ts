import { TradeHistoryMinfied } from '../trade-history/trade-history.interface';

export interface TradeInterface {
   id: string;
   currency: string;
   boughtAt: Date;
   boughtFor: number;
   price: number;
   amount: number;
   inExchange: boolean;
   createdAt: Date;
   updatedAt: Date;
   tradeHistory: TradeHistoryMinfied | null;
}

export type TradeMinified = Omit<TradeInterface, 'createdAt' | 'updatedAt'>;
