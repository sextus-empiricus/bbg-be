import { HttpService } from '@nestjs/axios';
import { ArgumentMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IconUrl } from '../../icon-url/entities/icon-url.entity';
import { IconUrlService } from '../../icon-url/icon-url.service';
import { AttachIconToTradePipe } from '../attach-icon-to-trade.pipe';

describe('AttachIconToTradePipe', () => {
   let pipe: AttachIconToTradePipe;
   let iconUrlService: IconUrlService;
   let httpService: HttpService;
   const mockMetadata = {} as ArgumentMetadata;
   const mockDtoIconExistInDb = {
      boughtAt: '2022-12-06',
      currency: 'btc',
      boughtFor: 500,
      price: 1000,
      amount: 0.5,
   };
   const mockDtoIconNotExistInDb = {
      ...mockDtoIconExistInDb,
      currency: 'eth',
   };
   const mockDtoIconNotFoundByApi = {
      ...mockDtoIconExistInDb,
      currency: 'not-found',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: IconUrlService,
               useValue: {
                  getBySymbol: jest.fn().mockImplementation((symbol) => {
                     if (symbol === 'btc') {
                        return new IconUrl();
                     }
                     if (symbol === 'eth') {
                        return null;
                     }
                     if (symbol === 'not-found') {
                        return null;
                     }
                  }),
                  create: jest.fn(),
               },
            },
            {
               provide: HttpService,
               useValue: {
                  get: jest.fn(),
                  pipe: jest.fn(),
               },
            },
         ],
      }).compile();

      iconUrlService = module.get<IconUrlService>(IconUrlService);
      httpService = module.get<HttpService>(HttpService);
      pipe = new AttachIconToTradePipe(iconUrlService, httpService);
   });
   it('AttachIconToTradePipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('IconUrlService should be defined', () => {
      expect(iconUrlService).toBeDefined();
   });
   it('HttpService should be defined', () => {
      expect(httpService).toBeDefined();
   });
   describe('targeted IconUrl record already exists', () => {
      it('should return a proper dto extended by IconUrl', async () => {
         expect(
            await pipe.transform(mockDtoIconExistInDb, mockMetadata),
         ).toStrictEqual({
            ...mockDtoIconExistInDb,
            iconUrl: expect.any(IconUrl),
         });
      });
   });
   describe('targeted IconUrl record does not exists', () => {
      describe('CoinMarketCapApi call - success', () => {
         it('should call `httpService.get` with proper data', async () => {
            const cmcUrlExpected = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${mockDtoIconNotExistInDb.currency}`;
            const spy = jest.spyOn(httpService, 'get');
            await pipe.transform(mockDtoIconNotExistInDb, mockMetadata);
            expect(spy).toBeCalledWith(
               cmcUrlExpected,
               expect.objectContaining({
                  headers: {
                     'X-CMC_PRO_API_KEY': expect.any(String),
                  },
               }),
            );
            spy.mockRestore();
         });
      });
      describe('CoinMarketCapApi call - failed', () => {
         it('should return a proper dto extended by {iconUrl: null}', async () => {
            expect(
               await pipe.transform(mockDtoIconNotFoundByApi, mockMetadata),
            ).toStrictEqual({
               ...mockDtoIconNotFoundByApi,
               iconUrl: null,
            });
         });
      });
   });
});
