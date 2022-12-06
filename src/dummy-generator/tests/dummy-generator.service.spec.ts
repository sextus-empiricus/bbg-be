import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApisService } from '../../external-apis/external-apis.service';
import { IconUrl } from '../../icon-url/entities';
import { IconUrlService } from '../../icon-url/icon-url.service';
import { TradeHistoryService } from '../../trade-history/trade-history.service';
import { TradesService } from '../../trades/trades.service';
import { DummyGeneratorService } from '../dummy-generator.service';

describe('DummyGeneratorService', () => {
   let service: DummyGeneratorService;
   let externalApisService: ExternalApisService;
   let tradeHistoryService: TradeHistoryService;
   let tradesService: TradesService;

   const mockNewTradeDto = {
      boughtAt: '2022-06-06',
      currency: 'eth',
      boughtFor: 500,
      price: 1000,
      amount: 0.5,
   };
   const mockGetCurrencyHistoricalDataResponse = {
      symbol: 'btc',
      market_data: { current_price: { usd: 1 } },
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            DummyGeneratorService,
            { provide: TradeHistoryService, useValue: { create: jest.fn() } },
            {
               provide: TradesService,
               useValue: {
                  create: jest
                     .fn()
                     .mockResolvedValue({ createdTradeId: 'id1234' }),
               },
            },
            {
               provide: ExternalApisService,
               useValue: {
                  getCurrencyHistoricalData: jest
                     .fn()
                     .mockResolvedValue(mockGetCurrencyHistoricalDataResponse),
               },
            },
            {
               provide: IconUrlService,
               useValue: {
                  attachIconUrlToTradeDto: jest.fn().mockResolvedValue({
                     ...mockNewTradeDto,
                     iconUrl: new IconUrl(),
                  }),
               },
            },
         ],
      }).compile();

      service = module.get<DummyGeneratorService>(DummyGeneratorService);
      tradesService = module.get<TradesService>(TradesService);
      tradeHistoryService =
         module.get<TradeHistoryService>(TradeHistoryService);
      externalApisService =
         module.get<ExternalApisService>(ExternalApisService);
   });

   it('DummyGeneratorService should be defined', () => {
      expect(service).toBeDefined();
   });

   describe('utility functions', () => {
      describe('getRandomDateSince', () => {
         const fromDate = new Date('2000-01-01');
         const now = new Date();
         it('returned date should be greater then provided value', () => {
            const result = service['getRandomDateSince'](fromDate);
            expect(+result).toBeGreaterThanOrEqual(+fromDate);
         });
         it('returned date should be lower then actual date', () => {
            const result = service['getRandomDateSince'](fromDate);
            expect(+result).toBeLessThanOrEqual(+now);
         });
      });
      describe('getRandomCurrienciyId', () => {
         it('should return random currency id', () => {
            const result = service['getRandomCurrienciyId']();
            expect(result).toStrictEqual(expect.any(String));
         });
      });
      describe('getNewTradeDto', () => {
         const mockBoughtAt = new Date('2022-01-01');
         it('should return `CreateTradeDto` object', async () => {
            const result = await service['getNewTradeDto'](
               mockGetCurrencyHistoricalDataResponse,
               mockBoughtAt,
            );
            expect(result).toStrictEqual({
               amount: expect.any(Number),
               boughtAt: expect.any(String),
               boughtFor: expect.any(Number),
               currency: expect.any(String),
               price: expect.any(Number),
               iconUrl: expect.any(IconUrl),
            });
         });
      });
      describe('getNewTradeHistoryDto', () => {
         const mockSoldAt = new Date();
         it('should return `CreateTradeHistoryDto` object', async () => {
            const result = await service['getNewTradeHistoryDto'](
               mockGetCurrencyHistoricalDataResponse,
               mockNewTradeDto,
               mockSoldAt,
            );
            expect(result).toStrictEqual({
               price: expect.any(Number),
               profitCash: expect.any(Number),
               profitPerc: expect.any(Number),
               soldAt: expect.any(String),
               soldFor: expect.any(Number),
            });
         });
      });
      describe('attachTradeHistory', () => {
         const mockCurrencyId = 'bitcoin';
         const mockTradeId = 'id1234';
         it('should call `this.getRandomDateSince` with proper params', async () => {
            const spy = jest.spyOn(service as any, 'getRandomDateSince');
            await service['attachTradeHistory'](
               mockNewTradeDto,
               mockCurrencyId,
               mockTradeId,
            );
            expect(spy).toBeCalledWith(new Date(mockNewTradeDto.boughtAt));
         });
         it('should call `externalApis.getCurrencyHistoricalData` with proper params', async () => {
            const spy = jest.spyOn(
               externalApisService,
               'getCurrencyHistoricalData',
            );
            await service['attachTradeHistory'](
               mockNewTradeDto,
               mockCurrencyId,
               mockTradeId,
            );
            expect(spy).toBeCalledWith(mockCurrencyId, expect.any(Date));
         });
         it('should call `this.getNewTradeHistoryDto` with proper params', async () => {
            const spy = jest.spyOn(service as any, 'getNewTradeHistoryDto');
            await service['attachTradeHistory'](
               mockNewTradeDto,
               mockCurrencyId,
               mockTradeId,
            );
            expect(spy).toBeCalledWith(
               mockGetCurrencyHistoricalDataResponse,
               mockNewTradeDto,
               expect.any(Date),
            );
         });
         it('should call `tradesService.create` with proper params', async () => {
            const spy = jest.spyOn(tradeHistoryService, 'create');
            const mockCreateTradeHistoryDto = service['getNewTradeHistoryDto'](
               mockGetCurrencyHistoricalDataResponse,
               mockNewTradeDto,
               new Date(),
            );
            await service['attachTradeHistory'](
               mockNewTradeDto,
               mockCurrencyId,
               mockTradeId,
            );
            expect(spy).toBeCalledWith(
               { ...mockCreateTradeHistoryDto, soldAt: expect.any(String) },
               mockTradeId,
            );
         });
      });
   });
   describe('generateTrades', () => {
      const mockUserId = 'id1234';
      it('should call a scope 10 times', async () => {
         const spy = jest.spyOn(service as any, 'getRandomCurrienciyId');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledTimes(10);
      });
      it('should call `this.getRandomDateSince` with proper params', async () => {
         const spy = jest.spyOn(service as any, 'getRandomDateSince');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledWith(new Date('2021-01-01'));
      });
      it('should call `this.getRandomCurrienciyId`', async () => {
         const spy = jest.spyOn(service as any, 'getRandomCurrienciyId');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalled();
      });
      it('should call `externalApisService.getCurrencyHistoricalData` with proper params', async () => {
         const spy = jest.spyOn(
            externalApisService,
            'getCurrencyHistoricalData',
         );
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledWith(expect.any(String), expect.any(Date));
      });
      it('should call `this.getNewTradeDto` with proper params', async () => {
         const spy = jest.spyOn(service as any, 'getNewTradeDto');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledWith(
            mockGetCurrencyHistoricalDataResponse,
            expect.any(Date),
         );
      });
      it('should call `tradesService.create` with proper params', async () => {
         const spy = jest.spyOn(tradesService, 'create');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledWith(
            { ...mockNewTradeDto, iconUrl: expect.any(IconUrl) },
            mockUserId,
         );
      });
      it('should call `this.attachTradeHistory` with proper params', async () => {
         const spy = jest.spyOn(service as any, 'attachTradeHistory');
         const { createdTradeId } = await tradesService.create(
            mockNewTradeDto,
            mockUserId,
         );
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledWith(
            { ...mockNewTradeDto, iconUrl: expect.any(IconUrl) },
            expect.any(String),
            createdTradeId,
         );
      });
      it('should call `this.attachTradeHistory` 5 times', async () => {
         const spy = jest.spyOn(service as any, 'attachTradeHistory');
         await service.generateTrades(mockUserId);
         expect(spy).toBeCalledTimes(5);
      });
   });
});
