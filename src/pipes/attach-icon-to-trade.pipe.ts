import { HttpService } from '@nestjs/axios';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { appConfig } from '../../config/app-config';
import { IconUrlService } from '../icon-url/icon-url.service';
import { CreateTradeDto } from '../trades/dto';

const { authHeader, getIconUrl } = appConfig.coinMarketCap;

@Injectable()
export class AttachIconToTradePipe implements PipeTransform {
   constructor(
      private readonly iconUrlService: IconUrlService,
      private readonly httpService: HttpService,
   ) {}

   async transform(
      createTradeDto: CreateTradeDto,
      metadata: ArgumentMetadata,
   ): Promise<any> {
    /*
    * ℹThe purpose of that logic is to avoid unessery API fetching for a common results as currency icon.
    * This pipe checks symbol(currency) provided in DTO by a user.
    * If entity of targeted symbol already exists in DB(IconUrl table) the pipe will attach it to the DTO.
    * If not it will fetch an external API to get a currency icon url, then create an entity of new currency in DB
    * and finaly attach it to a DTO. In a case a provided symbol wasn't found it returns null.
    * */
      const { currency: symbol } = createTradeDto;
      let iconUrl = await this.iconUrlService.getBySymbol(symbol);
      if (!iconUrl) {
         //1. fech external API for a currnecy icon url;
         try {
            const coinMarketCapApiResponse = await this.httpService
               .get(`${getIconUrl}?symbol=${symbol}`, {
                  headers: authHeader,
               })
               .pipe(map((res) => res.data));
            const data = await lastValueFrom(coinMarketCapApiResponse);
            const url = data.data[symbol.toUpperCase()][0].logo;
            //2. if it's successfull create a new entyty in IconUrl table and attach it to DTO
            await this.iconUrlService.create({
               symbol,
               url,
            });
            iconUrl = await this.iconUrlService.getBySymbol(symbol);
         } catch (e) {
            //3. if it's failed - do nth. We want to let a user add his trade anyway.
         }
      }
      return { ...createTradeDto, iconUrl };
   }
}
