import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ExternalApisService } from '../external-apis/external-apis.service';
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
      private tradeHistoryService: TradeHistoryService,
      private tradesService: TradesService,
      private externalApis: ExternalApisService,
   ) {}

   async generateTrades(userId: string) {
      for (let i = 0; i < 2; i++) {
         const [boughtAt, boughtForApi] = this.getRandomDateFrom(
            new Date('2021-01-01'),
         );
         const currencyId = this.getRandomCurrienciyId();
         const response = await this.externalApis.getCurrencyHistoricalData(
            currencyId,
            boughtForApi,
         );
         const newTradeDto = this.getNewTradeDto(response, boughtAt);
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
      //***TODO - update `attach-icon-to-trade` logic. it is not usefull here because it's a pipe;
   }

   //utility fns():
   private async attachTradeHistory(
      newTradeDto: CreateTradeDto,
      currencyId: string,
      tradeId: string,
   ): Promise<any> {
      const [soldAt, soldAtForApi] = this.getRandomDateFrom(
         new Date(newTradeDto.boughtAt),
      );
      const response = await this.externalApis.getCurrencyHistoricalData(
         currencyId,
         soldAtForApi,
      );
      const createTradeHistoryDto = this.getNewTradeHistoryDto(
         response,
         newTradeDto,
         soldAt,
      );
      await this.tradeHistoryService.create(createTradeHistoryDto, tradeId);
   }

   private getRandomDateFrom(from: Date): string[] {
      const randomDate = faker.date.between(from, new Date());
      const [day, month, year] = randomDate.toLocaleDateString().split('.');
      return [randomDate.toISOString(), `${day}-${month}-${year}`];
   }

   private getRandomCurrienciyId(): string {
      const randomIndex = faker.datatype.number({
         max: this.currencyIds.length - 1,
      });
      return this.currencyIds[randomIndex];
   }

   private getNewTradeDto(apiResponse: any, boughtAt: string): CreateTradeDto {
      const currency = apiResponse.symbol;
      const price = apiResponse.market_data.current_price.usd;
      const boughtFor = faker.datatype.number({ min: 10, max: 500 });
      const amount = boughtFor / price;
      return {
         amount,
         boughtAt,
         boughtFor,
         currency,
         price,
      };
   }

   private getNewTradeHistoryDto(
      apiResponse: any,
      newTradeDto: CreateTradeDto,
      soldAt: string,
   ): CreateTradeHistoryDto {
      const { usd: price } = apiResponse.market_data.current_price;
      const profitCash = price * newTradeDto.amount - newTradeDto.boughtFor;
      const profitPerc = (profitCash / newTradeDto.boughtFor) * 100;
      const soldFor = price * newTradeDto.amount;
      return {
         price,
         profitCash,
         profitPerc,
         soldAt,
         soldFor,
      };
   }
}
