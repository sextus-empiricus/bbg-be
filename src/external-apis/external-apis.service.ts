import { HttpService } from '@nestjs/axios';
import {
   Injectable,
   NotFoundException,
   ServiceUnavailableException,
} from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { appConfig } from '../config/app-config';

const { coinsUrl } = appConfig.externalApis.coinGecko;
const { authHeader, getIconUrl } = appConfig.externalApis.coinMarketCap;

@Injectable()
export class ExternalApisService {
   constructor(private httpService: HttpService) {}

   async getCurrencyHistoricalData(
      currencyId: string,
      date: Date,
   ): Promise<any> {
      const [day, month, year] = date.toLocaleDateString().split('.');
      const dateForApi = `${day}-${month}-${year}`;
      try {
         const coinGeckoApiResponse = await this.httpService
            .get(`${coinsUrl}/${currencyId}/history?date=${dateForApi}`)
            .pipe(map((res) => res.data));
         return await lastValueFrom(coinGeckoApiResponse);
      } catch (e) {
         throw new ServiceUnavailableException(
            'To many calls. Rate limit: 50 for minute.',
         );
      }
   }

   async getCurrencyInfo(symbol: string): Promise<any> {
      try {
         const coinMarketCapApiResponse = await this.httpService
            .get(`${getIconUrl}?symbol=${symbol}`, {
               headers: authHeader,
            })
            .pipe(map((res) => res.data));
         return await lastValueFrom(coinMarketCapApiResponse);
      } catch (e) {
         throw new NotFoundException('Icon of provided symbol not found.');
      }
   }
}
