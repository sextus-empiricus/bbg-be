import { outputFilter } from './outputFilter';
import { Trade } from '../entities/trade.entity';

const mockTrade = {
   id: 'id1234',
   amount: 1,
   boughtAt: new Date(),
   boughtFor: 1,
   currency: 'eth',
   price: 1,
   inExchange: true,
   iconUrl: null,
   tradeHistory: null,
   createdAt: new Date(),
   updatedAt: new Date(),
};

const mockIconUrl = {
   symbol: 'btc',
   url: 'https://google.com',
   createdAt: new Date(),
   updatedAt: new Date(),
};

const mockTradeHistory = {
   id: 'id1234',
   soldAt: new Date(),
   soldFor: 1,
   price: 1,
   profitPerc: 1,
   profitCash: 1,
   updatedAt: new Date(),
   createdAt: new Date(),
};

describe('outputFilter', () => {
   it('should return null', () => {
      expect(outputFilter(null)).toBe(null);
   });
   it('should return `TradeMinified` object in [] - object passed', () => {
      expect(outputFilter(mockTrade as Trade)).toStrictEqual([
         {
            id: expect.any(String),
            amount: expect.any(Number),
            boughtAt: expect.any(Date),
            boughtFor: expect.any(Number),
            currency: expect.any(String),
            price: expect.any(Number),
            inExchange: expect.any(Boolean),
            iconUrl: null,
            tradeHistory: null,
            // createdAt: new Date(), - should be removed;
            // updatedAt: new Date(), - should be removed;
         },
      ]);
   });
   it('should return `TradeMinified` object in [] - array passed', () => {
      expect(outputFilter([mockTrade] as Trade[])).toStrictEqual([
         {
            id: expect.any(String),
            amount: expect.any(Number),
            boughtAt: expect.any(Date),
            boughtFor: expect.any(Number),
            currency: expect.any(String),
            price: expect.any(Number),
            inExchange: expect.any(Boolean),
            iconUrl: null,
            tradeHistory: null,
            // createdAt: new Date(), - should be removed;
            // updatedAt: new Date(), - should be removed;
         },
      ]);
   });
   it('should minify `iconUrl` object', () => {
      const result = outputFilter({
         ...mockTrade,
         iconUrl: mockIconUrl,
      } as Trade);
      expect(result[0].iconUrl).toStrictEqual(expect.any(String));
   });
   it('should minify `tradeHistory` object', () => {
      const result = outputFilter({
         ...mockTrade,
         tradeHistory: mockTradeHistory,
      } as Trade);
      expect(result[0].tradeHistory).toStrictEqual({
         id: expect.any(String),
         soldAt: expect.any(Date),
         soldFor: expect.any(Number),
         price: expect.any(Number),
         profitPerc: expect.any(Number),
         profitCash: expect.any(Number),
         // updatedAt: expect.any(Date), - should be removed;
         // createdAt: expect.any(Date), - should be removed;
      });
   });
});
