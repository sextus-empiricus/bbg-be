import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IconUrlService } from '../../icon-url/icon-url.service';
import { ResponseStatus } from '../../types';
import { TradesController } from '../trades.controller';
import { TradesService } from '../trades.service';

describe('TradesController', () => {
   let controller: TradesController;
   let tradesService: TradesService;
   let iconUrlService: IconUrlService;
   let httpService: HttpService;
   let dataSource: DataSource;

   const mockTradeMini = {
      id: 'id1234',
      currency: 'btc',
      boughtAt: new Date(),
      boughtFor: 1,
      price: 1,
      amount: 1,
      inExchange: true,
      tradeHistory: {
         id: 'id1234',
         soldAt: new Date(),
         soldFor: 1,
         price: 1,
         profitPerc: 1,
         profitCash: 1,
      },
      iconUrl: 'https://google.com',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [TradesController],
         providers: [
            {
               provide: TradesService,
               useValue: {
                  create: jest.fn(() => ({
                     status: ResponseStatus.success,
                     createdTradeId: 'test1234',
                  })),
                  getAll: jest.fn(() => ({
                     status: ResponseStatus.success,
                     tradesList: [mockTradeMini],
                  })),
                  getById: jest.fn(() => ({
                     status: ResponseStatus.success,
                     trade: mockTradeMini,
                  })),
                  update: jest.fn((id) => ({
                     status: ResponseStatus.success,
                     updatedTradeId: id,
                  })),
                  remove: jest.fn((id) => ({
                     status: ResponseStatus.success,
                     deletedTradeId: id,
                  })),
               },
            },
            {
               provide: getDataSourceToken(),
               useValue: {},
            },
            {
               provide: IconUrlService,
               useValue: {},
            },
            {
               provide: HttpService,
               useValue: {},
            },
         ],
      }).compile();

      controller = module.get<TradesController>(TradesController);
      tradesService = module.get<TradesService>(TradesService);
      iconUrlService = module.get<IconUrlService>(IconUrlService);
      httpService = module.get<HttpService>(HttpService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('TradesController should be defined', () => {
      expect(controller).toBeDefined();
   });
   it('TradesService should be defined', () => {
      expect(tradesService).toBeDefined();
   });
   it('IconUrlService should be defined', () => {
      expect(iconUrlService).toBeDefined();
   });
   it('HttpService should be defined', () => {
      expect(httpService).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
   });

   describe('create', () => {
      const mockDto = {
         currency: 'btc',
         boughtAt: new Date().toDateString(),
         boughtFor: 1,
         price: 1,
         amount: 1,
      };
      const mockUserId = 'user1';

      it('should return `CreateTradeResponse` object', async () => {
         expect(await controller.create(mockDto, mockUserId)).toStrictEqual({
            status: ResponseStatus.success,
            createdTradeId: expect.any(String),
         });
      });
      it('should call `UsersService` with a proper dto', async () => {
         const spy = jest.spyOn(tradesService, 'create');
         await controller.create(mockDto, mockUserId);
         expect(spy).toHaveBeenCalledWith(mockDto, mockUserId);
      });
   });
   describe('getAll', () => {
      it('should return `GetAllTradesResponse` object', async () => {
         expect(await controller.getAll()).toStrictEqual({
            status: ResponseStatus.success,
            tradesList: [
               {
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
               },
            ],
         });
      });
      it('should call `UsersService`.getAll', async () => {
         const spy = jest.spyOn(tradesService, 'getAll');
         await controller.getAll();
         expect(spy).toBeCalled();
      });
   });
   describe('getById', () => {
      const mockId = 'test1234';
      it('should return `GetTradeByIdResponse` object', async () => {
         expect(await controller.getById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            trade: mockTradeMini,
         });
      });
      it('should call `TradesService.getById` with proper id', async () => {
         const spy = jest.spyOn(tradesService, 'getById');
         await controller.getById(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
   describe('update', () => {
      const mockId = 'test1234';
      const mockUpdateDto = {
         price: 2,
      };
      it('should return `UpdatedTradeResponse` object', async () => {
         expect(await controller.update(mockId, mockUpdateDto)).toStrictEqual({
            status: ResponseStatus.success,
            updatedTradeId: mockId,
         });
      });
      it('should call `TradesService.update` with proper arguments', async () => {
         const spy = jest.spyOn(tradesService, 'update');
         await controller.update(mockId, mockUpdateDto);
         expect(spy).toBeCalledWith(mockId, mockUpdateDto);
      });
   });
   describe('remove', () => {
      const mockId = 'test1234';
      it('should return `DeleteTradeByIdResponse` object', async () => {
         expect(await controller.remove(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            deletedTradeId: mockId,
         });
      });
      it('should call `TradesService.remove` with proper id', async () => {
         const spy = jest.spyOn(tradesService, 'remove');
         await controller.remove(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
});
