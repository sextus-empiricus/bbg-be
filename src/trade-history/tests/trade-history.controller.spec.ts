import { Test, TestingModule } from '@nestjs/testing';
import { ResponseStatus } from '../../types/api';
import { TradeHistoryController } from '../trade-history.controller';
import { TradeHistoryService } from '../trade-history.service';

describe('TradeHistoryController', () => {
   let controller: TradeHistoryController;
   let service: TradeHistoryService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [TradeHistoryController],
         providers: [
            {
               provide: TradeHistoryService,
               useValue: {
                  create: jest.fn((dto, tradeId) => ({
                     status: ResponseStatus.success,
                     createdTradeHistoryId: 'test1234',
                     relatedTradeId: tradeId,
                  })),
               },
            },
         ],
      }).compile();

      controller = module.get<TradeHistoryController>(TradeHistoryController);
      service = module.get<TradeHistoryService>(TradeHistoryService);
   });

   it('TradeHistoryController should be defined', () => {
      expect(controller).toBeDefined();
   });
   it('TradeHistoryService should be defined', () => {
      expect(service).toBeDefined();
   });
   describe('create', () => {
      const mockTradeId = 'id1234';
      const mockDto = {
         soldAt: new Date().toDateString(),
         soldFor: 1,
         price: 1,
         profitPerc: 1,
         profitCash: 1,
      };
      it('should return `CreateTradeHistoryResponse` object', async () => {
         expect(await controller.create(mockTradeId, mockDto)).toStrictEqual({
            status: ResponseStatus.success,
            createdTradeHistoryId: expect.any(String),
            relatedTradeId: mockTradeId,
         });
      });
      it('should call `TradeHistoryService.create` with proper dto', async () => {
         const spy = jest.spyOn(service, 'create');
         await controller.create(mockTradeId, mockDto);
         expect(spy).toBeCalledWith(mockDto, mockTradeId);
      });
   });
});
