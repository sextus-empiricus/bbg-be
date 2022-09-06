import { Trade } from '../entities/trade.entity';
import { TradeMinified } from '../../types/trades/trade.interface';

/*ℹThis filter cleans dry db fetched data and removes all unusefull rows for a client (as `createdAt` etc.).
  Function always returns TradeMinified[].
  At the begining that function was an internal part of `TradesService` class.
  I decided to move it to external file to make class code cleaner and manage easier with testitng it as private method.
  Jest.js doesn't have access to private methods declared within the class.
*/
export const outputFilterTrades = (
   trades: Trade[] | Trade | null,
): TradeMinified[] => {
   /*If `trades` is a null*/
   if (trades === null) {
      return [null];
   }
   /*If `trades` is an array:*/
   if (Array.isArray(trades)) {
      return trades.map((el) => {
         let tradeHistory = null;
         let iconUrl = null;
         if (el.tradeHistory) {
            const { createdAt, updatedAt, ...tradeHistoryMini } =
               el.tradeHistory;
            tradeHistory = tradeHistoryMini;
         }
         if (el.iconUrl) {
            const { url } = el.iconUrl;
            iconUrl = url;
         }
         const { createdAt, updatedAt, ...trade } = el;
         return { ...trade, tradeHistory, iconUrl };
      });
   }
   /*If trades is a signle `Trade` object:*/
   const { createdAt, updatedAt, ...trade } = trades;
   let tradeHistory = null;
   let iconUrl = null;
   if (trade.tradeHistory) {
      const { createdAt, updatedAt, ...tradeHistoryMini } = trade.tradeHistory;
      tradeHistory = tradeHistoryMini;
   }
   if (trade.iconUrl) {
      const { url } = trade.iconUrl;
      iconUrl = url;
   }
   return [
      {
         ...trade,
         tradeHistory,
         iconUrl,
      },
   ];
};