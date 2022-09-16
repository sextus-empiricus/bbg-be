import { ArgumentMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IconUrl } from '../../icon-url/entities';
import { IconUrlService } from '../../icon-url/icon-url.service';
import { AttachIconToTradePipe } from '../attach-icon-to-trade.pipe';

describe('AttachIconToTradePipe', () => {
   let pipe: AttachIconToTradePipe;
   let iconUrlService: IconUrlService;
   const mockMetadata = {} as ArgumentMetadata;
   const mockDto = {
      boughtAt: '2022-12-06',
      currency: 'btc',
      boughtFor: 500,
      price: 1000,
      amount: 0.5,
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: IconUrlService,
               useValue: {
                  attachIconUrlToTradeDto: jest
                     .fn()
                     .mockResolvedValue({ ...mockDto, iconUrl: new IconUrl() }),
               },
            },
         ],
      }).compile();

      iconUrlService = module.get<IconUrlService>(IconUrlService);
      pipe = new AttachIconToTradePipe(iconUrlService);
   });
   it('AttachIconToTradePipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('IconUrlService should be defined', () => {
      expect(iconUrlService).toBeDefined();
   });
   describe('transform', () => {
      it('should return a proper dto extended by IconUrl', async () => {
         expect(await pipe.transform(mockDto, mockMetadata)).toStrictEqual({
            ...mockDto,
            iconUrl: expect.any(IconUrl),
         });
      });
      it('should call `iconUrlService.attachIconUrlToTradeDto` with proper data', async () => {
         const spy = jest.spyOn(iconUrlService, 'attachIconUrlToTradeDto');
         await pipe.transform(mockDto, mockMetadata);
         expect(spy).toBeCalledWith(mockDto);
      });
   });
});
