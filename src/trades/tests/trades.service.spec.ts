import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ResponseStatus } from '../../types/api';
import { User } from '../../users/entities';
import { UsersService } from '../../users/users.service';
import { Trade } from '../entities';
import { TradesService } from '../trades.service';

describe('TradesService', () => {
   let service: TradesService;
   let dataSource: DataSource;

   const mockTrade = {
      id: 'id1234',
      currency: 'btc',
      boughtAt: new Date(),
      boughtFor: 1,
      price: 1,
      amount: 1,
      inExchange: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tradeHistory: {
         id: 'id1234',
         soldAt: new Date(),
         soldFor: 1,
         price: 1,
         profitPerc: 1,
         profitCash: 1,
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      iconUrl: {
         symbol: 'sol',
         url: 'https//:google.com',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   };
   const mockTradeMinified = {
      id: expect.any(String),
      currency: expect.any(String),
      boughtAt: expect.any(Date),
      boughtFor: expect.any(Number),
      price: expect.any(Number),
      amount: expect.any(Number),
      inExchange: expect.any(Boolean),
      tradeHistory: {
         id: expect.any(String),
         soldAt: expect.any(Date),
         soldFor: expect.any(Number),
         price: expect.any(Number),
         profitPerc: expect.any(Number),
         profitCash: expect.any(Number),
      },
      iconUrl: expect.any(String),
   };

   const mockUser = {} as User;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            TradesService,
            {
               provide: UsersService,
               useValue: {
                  getById: jest.fn().mockResolvedValue({
                     status: ResponseStatus.success,
                     user: mockUser,
                  }),
               },
            },
            {
               provide: DataSource,
               useValue: {
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  execute: jest.fn().mockImplementationOnce(() => ({
                     identifiers: [{ id: 'test1234' }],
                  })),
                  //insert:
                  insert: jest.fn().mockReturnThis(),
                  into: jest.fn().mockReturnThis(),
                  values: jest.fn().mockReturnThis(),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  leftJoinAndSelect: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getOne: jest.fn().mockResolvedValueOnce(mockTrade),
                  getMany: jest.fn().mockResolvedValue([mockTrade]),
                  //update:
                  update: jest.fn().mockReturnThis(),
                  set: jest.fn().mockReturnThis(),
               },
            },
         ],
      }).compile();

      service = module.get<TradesService>(TradesService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('TradesService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(service).toBeDefined();
   });
   describe('create', () => {
      const mockUserId = 'user1';
      const mockDto = {
         boughtAt: '2022-12-06',
         currency: 'btc',
         boughtFor: 500,
         price: 1000,
         amount: 0.5,
      };
      it('should return `CreateTradeResponse` object', async () => {
         expect(await service.create(mockDto, mockUserId)).toStrictEqual({
            status: ResponseStatus.success,
            createdTradeId: expect.any(String),
         });
      });
      it('should create query builder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.create(mockDto, mockUserId);
         expect(spy).toBeCalledTimes(1);
      });
      it('should call `dataSource.into` with the Trade entity', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'into',
         );
         await service.create(mockDto, mockUserId);
         expect(spy).toBeCalledWith(Trade);
      });
      it('should call a dataSource.value which a proper dto', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'values',
         );
         await service.create(mockDto, mockUserId);
         expect(spy).toHaveBeenCalledWith({ ...mockDto, user: mockUser });
      });
   });
   describe('getAll', () => {
      it('should return `GetAllTradesResponse` object', async () => {
         expect(await service.getAll()).toStrictEqual({
            status: ResponseStatus.success,
            tradesList: [mockTradeMinified],
         });
      });
      it('should create query builder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.getAll();
         expect(spy).toBeCalledTimes(1);
      });
      it('should call `ds.cqb.select` witch `trade` string', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getAll();
         expect(spy).toBeCalledWith('trade');
      });
      it('should call `ds.cqb.from` witch `Trade`-entity and `trade`-alias', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getAll();
         expect(spy).toBeCalledWith(Trade, 'trade');
      });
      it('should call first `ds.cqb.leftJoinAndSelect` witch `trade.tradeHistory`-property and `tradeHistory`-alias', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder(),
            'leftJoinAndSelect',
         );
         await service.getAll();
         expect(spy).toBeCalledWith('trade.tradeHistory', 'tradeHistory');
      });
      it('should call second `ds.cqb.leftJoinAndSelect` witch `trade.iconUrl`-property and `iconUrl`-alias', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder(),
            'leftJoinAndSelect',
         );
         await service.getAll();
         expect(spy).toBeCalledWith('trade.iconUrl', 'iconUrl');
      });
   });
   describe('getById', () => {
      const mockId = 'id1234';
      it('should return `GetTradeByIdResponse` object', async () => {
         expect(await service.getById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            trade: mockTradeMinified,
         });
      });
      it('should create query builder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await service.getById(mockId);
         expect(spy).toBeCalledTimes(1);
      });
      it('should call `ds.cqb.select` witch `trade` string', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getById(mockId);
         expect(spy).toBeCalledWith('trade');
      });
      it('should call `ds.cqb.from` witch `Trade`-entity and `trade`-alias', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getById(mockId);
         expect(spy).toBeCalledWith(Trade, 'trade');
      });
      it('should call first `ds.cqb.leftJoinAndSelect` witch `trade.tradeHistory`-property and `tradeHistory`-alias', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder(),
            'leftJoinAndSelect',
         );
         await service.getById(mockId);
         expect(spy).toBeCalledWith('trade.tradeHistory', 'tradeHistory');
      });
      it('should call second `ds.cqb.leftJoinAndSelect` witch `trade.iconUrl`-property and `iconUrl`-alias', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder(),
            'leftJoinAndSelect',
         );
         await service.getById(mockId);
         expect(spy).toBeCalledWith('trade.iconUrl', 'iconUrl');
      });
      it('should call second `ds.cqb.where` witch secure param id', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.getById(mockId);
         expect(spy).toBeCalledWith('trade.id = :id', { id: mockId });
      });
      describe('update', () => {
         const mockId = 'id1234';
         const mockDto = {
            price: 1,
         };
         it('should return `UpdatedTradeResponse` object', async () => {
            expect(await service.update(mockId, mockDto)).toStrictEqual({
               status: ResponseStatus.success,
               updatedTradeId: mockId,
            });
         });
         it('should call query builder once', async () => {
            const spy = jest.spyOn(dataSource, 'createQueryBuilder');
            await service.update(mockId, mockDto);
            expect(spy).toBeCalledTimes(1);
         });
         it('should call dt.cqb.update with `Trade` entity', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'update');
            await service.update(mockId, mockDto);
            expect(spy).toBeCalledWith(Trade);
         });
         it('should call dt.cqb.set with proper dto', async () => {
            const spy = jest.spyOn(
               dataSource.createQueryBuilder().update(),
               'set',
            );
            await service.update(mockId, mockDto);
            expect(spy).toBeCalledWith(mockDto);
         });
         it('should call dt.cqb.where with proper id', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
            await service.update(mockId, mockDto);
            expect(spy).toBeCalledWith({ id: mockId });
         });
      });
   });
});
