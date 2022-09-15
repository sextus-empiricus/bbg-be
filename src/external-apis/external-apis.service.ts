import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { appConfig } from '../../config/app-config';

const { coinsUrl } = appConfig.externalApis.coinGecko;

@Injectable()
export class ExternalApisService {
   constructor(private httpService: HttpService) {}

   /**Fn() calls external `CoinGecko` API. It has 50 calls per minute rate limit.
    * @param {string} currencyId currency id of coingGecko API;
    * @param {string} date DD-MM-YYYY;
    * */
   async getCurrencyHistoricalData(currencyId: string, date: string) {
      try {
         const coinGeckoApiResponse = await this.httpService
            .get(`${coinsUrl}/${currencyId}/history?date=${date}`)
            .pipe(map((res) => res.data));
         return await lastValueFrom(coinGeckoApiResponse);
      } catch (e) {
         throw new ServiceUnavailableException();
      }
   }
}
