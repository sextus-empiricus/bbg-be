import { CreateTradeHistoryDto } from '../dto/create-trade-history.dto';
import { DataSource } from 'typeorm';
import { ResponseStatus } from '../../types/api/response';
import { Test, TestingModule } from '@nestjs/testing';
import { Trade } from '../../trades/entities/trade.entity';
import { TradeHistory } from '../entities/trade-history.entity';
import { TradeHistoryService } from '../trade-history.service';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('TradeHistoryService', () => {
   let service: TradeHistoryService;
   let dataSource: DataSource;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            TradeHistoryService,
            {
               provide: getDataSourceToken(),
               useValue: {
                  //general:
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  execute: jest.fn(() => ({
                     identifiers: [{ id: 'test1234' }],
                  })),
                  getOne: jest.fn(() => ({} as TradeHistory)),
                  //insert:
                  insert: jest.fn().mockReturnThis(),
                  into: jest.fn().mockReturnThis(),
                  values: jest.fn().mockReturnThis(),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  //update:
                  update: jest.fn().mockReturnThis(),
                  set: jest.fn().mockReturnThis(),
               },
            },
         ],
      }).compile();

      service = module.get<TradeHistoryService>(TradeHistoryService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('TradeHistoryService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
   });
   describe('create', () => {
      const mockDto = { trade: { id: 'test1234' } };
      it('should return `CreateTradeHistoryResponse` object', async () => {
         expect(
            await service.create(mockDto as CreateTradeHistoryDto),
         ).toStrictEqual({
            status: ResponseStatus.success,
            createdTradeHistoryId: expect.any(String),
            relatedTradeId: expect.any(String),
         });
      });
      it('should call `dataSource.createQueryBuilder` 3 times', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledTimes(3);
      });
      it('should call `dataSource.into` with the User entity', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'into',
         );
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledWith(TradeHistory);
      });
      it('should call a dataSource.value with a proper dto', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'values',
         );
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledWith(mockDto);
      });
      it('should call a dataSource.update with `Trade` entity', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'update');
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledWith(Trade);
      });
      it('should call a dataSource.set with a proper dto', async () => {
         const setDtoMock = {
            inExchange: false,
            tradeHistory: {} as TradeHistory,
         };
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().update(),
            'set',
         );
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledWith(setDtoMock);
      });
      it('should call a dataSource.where with a proper id', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().update(),
            'where',
         );
         await service.create(mockDto as CreateTradeHistoryDto);
         expect(spy).toBeCalledWith({ id: mockDto.trade.id });
      });
   });
});
