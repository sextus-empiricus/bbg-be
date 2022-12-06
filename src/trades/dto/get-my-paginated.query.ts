import { IsEnum, IsOptional } from 'class-validator';
import {
   GetMyPaginatedQueryInterface,
   QueryOrder,
   QuerySortBy,
} from '../../types';

export class GetMyPaginatedQuery implements GetMyPaginatedQueryInterface {
   @IsOptional()
   historical: string;

   @IsOptional()
   @IsEnum(QuerySortBy, {
      message:
         'Incorrect query param. Allowed values: "amount", "boughtAt", "boughtFor", "currency", "sellPrice", "buyPrice", "profitCash", "profitPerc", "soldAt".',
   })
   sortBy: QuerySortBy;

   @IsOptional()
   @IsEnum(QueryOrder, {
      message: 'Incorrect query param. Allowed values: "asc", "desc".',
   })
   order: QueryOrder;

   @IsOptional()
   currency: string;

   @IsOptional()
   page: number;

   @IsOptional()
   limit: number;

   @IsOptional()
   from: string;

   @IsOptional()
   to: string;
}
