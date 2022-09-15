import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApisService } from '../../external-apis/external-apis.service';
import { IconUrl } from '../../icon-url/entities';
import { IconUrlService } from '../../icon-url/icon-url.service';
import { TradeHistoryService } from '../../trade-history/trade-history.service';
import { TradesService } from '../../trades/trades.service';
import { ResponseStatus } from '../../types/api';
import { DummyGeneratorController } from '../dummy-generator.controller';
import { DummyGeneratorService } from '../dummy-generator.service';

describe('DummyGeneratorController', () => {
   let controller: DummyGeneratorController;
   let service: DummyGeneratorService;
   const mockNewTradeDto = {
      boughtAt: '2022-06-06',
      currency: 'eth',
      boughtFor: 500,
      price: 1000,
      amount: 0.5,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [DummyGeneratorController],
         providers: [
            DummyGeneratorService,
            {
               provide: TradeHistoryService,
               useValue: {
                  create: jest.fn(),
               },
            },
            {
               provide: TradesService,
               useValue: {
                  create: jest.fn().mockResolvedValue({
                     createdTradeId: 'id1234',
                  }),
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
            {
               provide: ExternalApisService,
               useValue: {
                  getCurrencyHistoricalData: jest.fn().mockResolvedValue({
                     symbol: 'btc',
                     market_data: { current_price: { usd: 5000 } },
                  }),
               },
            },
         ],
      }).compile();

      controller = module.get<DummyGeneratorController>(
         DummyGeneratorController,
      );
      service = module.get<DummyGeneratorService>(DummyGeneratorService);
   });

   it('DummyGeneratorController should be defined', () => {
      expect(controller).toBeDefined();
   });
   it('DummyGeneratorService should be defined', () => {
      expect(controller).toBeDefined();
   });
   describe('dummyGeneratorService', () => {
      const mockId = 'id1234';
      it('should return `SuccessResponse` object', async () => {
         expect(await controller.generateDummyTrades(mockId)).toStrictEqual({
            status: ResponseStatus.success,
         });
      });
      it('should pass to `dummyGeneratorService.generateTrades` a proper data', async () => {
         const spy = jest.spyOn(service, 'generateTrades');
         await controller.generateDummyTrades(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
});
