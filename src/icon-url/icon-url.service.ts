import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { CreateIconUrlDto } from '../types/icon-url';
import { IconUrlInterface } from '../types/icon-url';
import { IconUrl } from './entities';

@Injectable()
export class IconUrlService {
   @Inject(DataSource) private readonly dataSource: DataSource;

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
}
