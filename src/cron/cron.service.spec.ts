import { CronService } from './cron.service';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Trade } from '../trades/entities/trade.entity';
import { TradeHistory } from '../trade-history/entities/trade-history.entity';
import { User } from '../users/entities/user.entity';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('CronService', () => {
   let service: CronService;
   let dataSource: DataSource;

   const mockUser = {
      id: 'id1234',
      authToken: '',
      email: 'test@test.test',
      isActive: false,
      password: 'test1234',
      trades: [],
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   const mockRelatedTradeHistory = {
      id: 'id1234',
      price: 1,
      profitCash: 1,
      profitPerc: 1,
      soldAt: new Date(),
      soldFor: 1,
      trade: {} as Trade,
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   const mockUnrelatedTradeHistory = {
      id: 'id1234',
      price: 1,
      profitCash: 1,
      profitPerc: 1,
      soldAt: new Date(),
      soldFor: 1,
      trade: null,
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            CronService,
            {
               provide: getDataSourceToken(),
               useValue: {
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  execute: jest.fn().mockReturnThis(),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getMany: jest
                     .fn()
                     .mockReturnValueOnce([mockUser])
                     .mockReturnValueOnce([mockRelatedTradeHistory])
                     .mockReturnValueOnce([mockUnrelatedTradeHistory]),
                  leftJoinAndSelect: jest.fn().mockReturnThis(),
                  //delete:
                  delete: jest.fn().mockReturnThis(),
               },
            },
         ],
      }).compile();

      service = module.get<CronService>(CronService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('CronService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(service).toBeDefined();
   });
   describe('deleteDeactivatedUsers', () => {
      describe('first dataSource call', () => {
         it('should return deactivated users', async () => {
            const deactivatedUsersMock = await dataSource
               .createQueryBuilder()
               .getMany();
            expect(deactivatedUsersMock[0].isActive).toBe(false);
         });
         it('should call ds.cqb.select with `user` strings', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
            await service.deleteDeactivatedUsers();
            expect(spy).toBeCalledWith('user');
         });
         it('should call ds.cqb.from with `User`-entity and `user`-alias', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
            await service.deleteDeactivatedUsers();
            expect(spy).toBeCalledWith(User, 'user');
         });
         it('should call ds.cqb.where with {isActive: false} object', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
            await service.deleteDeactivatedUsers();
            expect(spy).toBeCalledWith({ isActive: false });
         });
      });
      describe('second dataSource call', () => {
         it('should call ds.cqb.from with `User`-entity and `user`-alias', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
            await service.deleteDeactivatedUsers();
            expect(spy).toBeCalledWith(User, 'user');
         });
         it('should call ds.cqb.where with a proper id', async () => {
            const deactivatedUsersMock = await dataSource
               .createQueryBuilder()
               .getMany();
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
            await service.deleteDeactivatedUsers();
            expect(spy).toBeCalledWith({ id: deactivatedUsersMock[0].id });
         });
      });
   });
   describe('deleteUnrelatedTradeHistoryRecords', () => {
      describe('first dataSource call', () => {
         const tradeHistoryStr = 'tradeHistory';
         it('should call dt.cqb.select with `tradeHistory` string', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toHaveBeenCalledWith(tradeHistoryStr);
         });
         it('should call dt.cqb.from with `TradeHistory`-entity and `tradeHistory`-string', async () => {
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toHaveBeenCalledWith(TradeHistory, tradeHistoryStr);
         });
         it('should call dt.cqb.leftJoinAndSelect with `radeHistory.trade`-property and `trade`-alias', async () => {
            const mockProperty = 'tradeHistory.trade';
            const mockAlias = 'trade';
            const spy = jest.spyOn(
               dataSource.createQueryBuilder(),
               'leftJoinAndSelect',
            );
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toHaveBeenCalledWith(mockProperty, mockAlias);
         });
      });
      describe('first dataSource call', () => {
         const tradeHistoryStr = 'tradeHistory';
         it('should not be called if el.trade = null', async () => {
            //run it once to get `.mockReturnValueOnce([mockRelatedTradeHistory])`;
            await dataSource.createQueryBuilder().getMany();
            //actual test:
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'delete');
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toBeCalledTimes(0);
         });
         it('should call dt.cqb.from with `TradeHistory`-entity and `tradeHistory`-alias', async () => {
            //run it twice to get 3rd mock value;
            await dataSource.createQueryBuilder().getMany();
            await dataSource.createQueryBuilder().getMany();
            //actual test:
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toBeCalledWith(TradeHistory, tradeHistoryStr);
         });
         it('should call ds.cqb.where with a proper id', async () => {
            //run it once to get 2nd mock value;
            await dataSource.createQueryBuilder().getMany();
            //actual test:
            const tradeHistoryRecords = await dataSource
               .createQueryBuilder()
               .getMany();
            const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
            await service.deleteUnrelatedTradeHistoryRecords();
            expect(spy).toBeCalledWith({ id: tradeHistoryRecords[0].id });
         });
      });
   });
});
