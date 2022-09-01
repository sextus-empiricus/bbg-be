import { DataSource } from 'typeorm';
import { IconUrl } from '../entities/icon-url.entity';
import { IconUrlService } from '../icon-url.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('IconUrlService', () => {
   let service: IconUrlService;
   let dataSource: DataSource;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            IconUrlService,
            {
               provide: getDataSourceToken(),
               useValue: {
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  //insert:
                  insert: jest.fn().mockReturnThis(),
                  into: jest.fn().mockReturnThis(),
                  values: jest.fn().mockReturnThis(),
                  execute: jest.fn((dto) => ({
                     identifiers: [{ symbol: 'btc' }],
                  })),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getOne: jest.fn((symbol) => ({
                     symbol: 'btc',
                     url: 'https://google.com',
                     createdAt: new Date(),
                     updatedAt: new Date(),
                  })),
               },
            },
         ],
      }).compile();

      service = module.get<IconUrlService>(IconUrlService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('IconUrlService should be defined', () => {
      expect(service).toBeDefined();
   });

   it('DataSource should be defined', () => {
      expect(service).toBeDefined();
   });

   describe('create', () => {
      const dtoMock = {
         symbol: 'btc',
         url: 'https://google.com',
      };
      it('should return symbol-id', async () => {
         expect(await service.create(dtoMock)).toStrictEqual(
            expect.any(String),
         );
      });
      it('should call datasource.into with the IconUrl entity', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'into',
         );
         await service.create(dtoMock);
         expect(spy).toHaveBeenCalledWith(IconUrl);
      });
      it('should call a dataSource.value which a proper DTO', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'values',
         );
         await service.create(dtoMock);
         expect(spy).toHaveBeenCalledWith(dtoMock);
      });
   });
   describe('findOneBySymbol', () => {
      const mockSymbol = 'btc';
      it('should return IconUrl object', async () => {
         expect(await service.getOneBySymbol(mockSymbol)).toStrictEqual({
            symbol: expect.any(String),
            url: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
         });
      });
      it('should call a dataSource.select which a proper selection', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getOneBySymbol(mockSymbol);
         expect(spy).toBeCalledWith('iconUrl');
      });
      it('should call a dataSource.from which a IconUrl entity', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getOneBySymbol(mockSymbol);
         expect(spy).toBeCalledWith(IconUrl, 'iconUrl');
      });
      it('should call a dataSource.where which a provided symbol', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.getOneBySymbol(mockSymbol);
         expect(spy).toBeCalledWith({ symbol: mockSymbol });
      });
   });
});
