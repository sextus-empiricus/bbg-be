import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ExternalApisService } from '../external-apis/external-apis.service';
import { CreateTradeDto } from '../trades/dto';
import { CreateIconUrlDto } from '../types/icon-url';
import { IconUrlInterface } from '../types/icon-url';
import { IconUrl } from './entities';

@Injectable()
export class IconUrlService {
   constructor(
      @Inject(DataSource) private readonly dataSource: DataSource,
      private readonly externalApisService: ExternalApisService,
   ) {}

   async create(createIconUrlDto: CreateIconUrlDto): Promise<string> {
      const insertResult: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(IconUrl)
         .values(createIconUrlDto)
         .execute();
      return insertResult.identifiers[0].symbol;
   }

   async getBySymbol(symbol: string): Promise<IconUrlInterface> | null {
      return await this.dataSource
         .createQueryBuilder()
         .select('iconUrl')
         .from(IconUrl, 'iconUrl')
         .where({ symbol })
         .getOne();
   }

   async attachIconUrlToTradeDto(
      createTradeDto: CreateTradeDto,
   ): Promise<CreateTradeDto> {
      const { currency: symbol } = createTradeDto;
      let iconUrl = await this.getBySymbol(symbol);
      try {
         if (!iconUrl) {
            //1. fech external API for a currnecy icon url;
            const data = await this.externalApisService.getCurrencyInfo(symbol);
            const url = data.data[symbol.toUpperCase()][0].logo;
            //2. if it's successfull create a new entyty in IconUrl table and attach it to DTO
            await this.create({
               symbol,
               url,
            });
            iconUrl = await this.getBySymbol(symbol);
         }
      } catch (e) {
         //Icon not found. Attach nothing.
      }
      return { ...createTradeDto, iconUrl };
   }
}
