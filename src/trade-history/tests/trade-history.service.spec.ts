import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TradesService } from '../../trades/trades.service';
import { ResponseStatus } from '../../types/api/response';
import { TradeHistory } from '../entities/trade-history.entity';
import { TradeHistoryService } from '../trade-history.service';

describe('TradeHistoryService', () => {
   let service: TradeHistoryService;
   let tradesService: TradesService;
   let dataSource: DataSource;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            TradeHistoryService,
            {
               provide: TradesService,
               useValue: {
                  update: jest.fn(),
               },
            },
            {
               provide: getDataSourceToken(),
               useValue: {
                  //general:
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  execute: jest.fn().mockResolvedValue({
                     identifiers: [{ id: 'id1234' }],
                  }),
                  getOne: jest.fn().mockResolvedValue({} as TradeHistory),
                  //insert:
                  insert: jest.fn().mockReturnThis(),
                  into: jest.fn().mockReturnThis(),
                  values: jest.fn().mockReturnThis(),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
               },
            },
         ],
      }).compile();

      service = module.get<TradeHistoryService>(TradeHistoryService);
      tradesService = module.get<TradesService>(TradesService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('TradeHistoryService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('TradesService should be defined', () => {
      expect(tradesService).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
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
         expect(await service.create(mockDto, mockTradeId)).toStrictEqual({
            status: ResponseStatus.success,
            createdTradeHistoryId: expect.any(String),
            relatedTradeId: mockTradeId,
         });
      });
      it('should call `dataSource.createQueryBuilder` twice', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.create(mockDto, mockTradeId);
         expect(spy).toBeCalledTimes(2);
      });
      it('should call `dataSource.into` with the TradeHistory entity', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'into',
         );
         await service.create(mockDto, mockTradeId);
         expect(spy).toBeCalledWith(TradeHistory);
      });
      it('should call a dataSource.value with a proper dto', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'values',
         );
         await service.create(mockDto, mockTradeId);
         expect(spy).toBeCalledWith(mockDto);
      });
      it('should call `this.getById` with proper id', async () => {
         const spy = jest.spyOn(service, 'getById');
         const { createdTradeHistoryId } = await service.create(
            mockDto,
            mockTradeId,
         );
         expect(spy).toBeCalledWith(createdTradeHistoryId);
      });
      it('should call `tradesService.update` with proper data', async () => {
         const spy = jest.spyOn(tradesService, 'update');
         await service.create(mockDto, mockTradeId);
         expect(spy).toBeCalledWith(mockTradeId, {
            inExchange: false,
            tradeHistory: {} as TradeHistory,
         });
      });
   });
   describe('getById', () => {
      const mockSelection = 'tradeHistory';
      const mockAliasName = 'tradeHistory';
      const mockId = 'id1234';
      it('should return `TradeHistory` object', async () => {
         expect(await service.getById(mockId)).toStrictEqual(
            {} as TradeHistory,
         );
      });
      it('should call queryBuilder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.getById(mockId);
         expect(spy).toBeCalledTimes(1);
      });
      it('should call dt.cqb.select with proper selection', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getById(mockId);
         expect(spy).toBeCalledWith(mockSelection);
      });
      it('should call dt.cqb.from with proper entity and alias', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getById(mockId);
         expect(spy).toBeCalledWith(TradeHistory, mockAliasName);
      });
      it('should call dt.cqb.where with proper id', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.getById(mockId);
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
});
