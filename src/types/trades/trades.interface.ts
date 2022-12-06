import { IconUrlInterfaceMinified } from '../icon-url';
import { TradeHistoryInterfaceMinfied } from '../trade-history';

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
   tradeHistory: TradeHistoryInterfaceMinfied | null;
   iconUrl: IconUrlInterfaceMinified | null;
}

export type TradeMinified = Omit<TradeInterface, 'createdAt' | 'updatedAt'>;
