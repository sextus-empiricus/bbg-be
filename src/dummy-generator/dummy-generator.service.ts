import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ExternalApisService } from '../external-apis/external-apis.service';
import { IconUrlService } from '../icon-url/icon-url.service';
import { CreateTradeHistoryDto } from '../trade-history/dto';
import { TradeHistoryService } from '../trade-history/trade-history.service';
import { CreateTradeDto } from '../trades/dto';
import { TradesService } from '../trades/trades.service';

@Injectable()
export class DummyGeneratorService {
   private currencyIds: string[] = [
      'bitcoin',
      'cardano',
      'dogecoin',
      'ethereum',
      'litecoin',
      'matic-network',
      'polkadot',
      'ripple',
      'solana',
      'uniswap',
   ];

   constructor(
      private readonly tradeHistoryService: TradeHistoryService,
      private readonly tradesService: TradesService,
      private readonly externalApisService: ExternalApisService,
      private readonly iconUrlService: IconUrlService,
   ) {}

   async generateTrades(userId: string): Promise<void> {
      for (let i = 0; i < 10; i++) {
         const boughtAt = this.getRandomDateSince(new Date('2021-01-01'));
         const currencyId = this.getRandomCurrienciyId();
         const response =
            await this.externalApisService.getCurrencyHistoricalData(
               currencyId,
               boughtAt,
            );
         const newTradeDto = await this.getNewTradeDto(response, boughtAt);
         const { createdTradeId } = await this.tradesService.create(
            newTradeDto,
            userId,
         );
         if (i % 2 !== 0)
            await this.attachTradeHistory(
               newTradeDto,
               currencyId,
               createdTradeId,
            );
      }
   }

   //utility fns():
   private async attachTradeHistory(
      newTradeDto: CreateTradeDto,
      currencyId: string,
      tradeId: string,
   ): Promise<void> {
      const soldAt = this.getRandomDateSince(new Date(newTradeDto.boughtAt));
      const response = await this.externalApisService.getCurrencyHistoricalData(
         currencyId,
         soldAt,
      );
      const createTradeHistoryDto = this.getNewTradeHistoryDto(
         response,
         newTradeDto,
         soldAt,
      );
      await this.tradeHistoryService.create(createTradeHistoryDto, tradeId);
   }

   private getRandomDateSince(from: Date): Date {
      return faker.date.between(from, new Date());
   }

   private getRandomCurrienciyId(): string {
      const randomIndex = faker.datatype.number({
         max: this.currencyIds.length - 1,
      });
      return this.currencyIds[randomIndex];
   }

   private async getNewTradeDto(
      apiResponse: any,
      boughtAt: Date,
   ): Promise<CreateTradeDto> {
      const currency = apiResponse.symbol;
      const price = apiResponse.market_data.current_price.usd;
      const boughtFor = faker.datatype.number({ min: 10, max: 500 });
      const amount = boughtFor / price;
      return await this.iconUrlService.attachIconUrlToTradeDto({
         amount,
         boughtAt: boughtAt.toISOString(),
         boughtFor,
         currency,
         price,
      });
   }

   private getNewTradeHistoryDto(
      apiResponse: any,
      newTradeDto: CreateTradeDto,
      soldAt: Date,
   ): CreateTradeHistoryDto {
      const { usd: price } = apiResponse.market_data.current_price;
      const profitCash = price * newTradeDto.amount - newTradeDto.boughtFor;
      const profitPerc = (profitCash / newTradeDto.boughtFor) * 100;
      const soldFor = price * newTradeDto.amount;
      return {
         price,
         profitCash,
         profitPerc,
         soldAt: soldAt.toISOString(),
         soldFor,
      };
   }
}
