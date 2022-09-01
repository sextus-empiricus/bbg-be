import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateTradeDto } from '../trades/dto';
import { HttpService } from '@nestjs/axios';
import { IconUrlService } from '../icon-url/icon-url.service';
import { appConfig } from '../../config/app-config';
import { lastValueFrom, map } from 'rxjs';

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
      /*ℹThe purpose of that logic is to avoid unessery API fetching for a common results as currency icon.
      This pipe checks symbol(currency) provided in DTO by a user.
      If entity of targeted symbol already exists in DB(IconUrl table) the pipe will attach it to the DTO.
      If not it will fetch an external API to get a currency icon url, then create an entity of new currency in DB
      and finaly attach it to a DTO. In a case a provided symbol wasn't found it returns null.*/
      const { currency: symbol } = createTradeDto;
      let iconUrl = await this.iconUrlService.getOneBySymbol(symbol);
      if (iconUrl === null) {
         try {
            //1. fech external API for a currnecy icon url;
            const cmcRes = await this.httpService
               .get(`${getIconUrl}?symbol=${symbol}`, {
                  headers: authHeader,
               })
               .pipe(map((res) => res.data));
            const data = await lastValueFrom(cmcRes);
            const url = data.data[symbol.toUpperCase()][0].logo;
            //2. if it's successfull create a new entyty in IconUrl table and attach it to DTO
            await this.iconUrlService.create({
               symbol,
               url,
            });
            iconUrl = await this.iconUrlService.getOneBySymbol(symbol);
         } catch (e) {
            //3. if it's failed - do nth. We want to let a user add his trade anyway.
            console.log(e.code);
         }
      }
      return { ...createTradeDto, iconUrl };
   }
}
