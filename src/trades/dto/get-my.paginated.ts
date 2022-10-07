import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryOrder, QuerySortBy } from '../../types/trades';

export class GetMyPaginated {
   @IsOptional()
   @IsString()
   historical: string;

   @IsOptional()
   @IsEnum(QuerySortBy)
   sortBy: string;

   @IsOptional()
   @IsEnum(QueryOrder)
   order: string;

   @IsOptional()
   @IsString()
   currency: string;

   @IsOptional()
   @IsString()
   page: string;

   @IsOptional()
   @IsString()
   limit: string;

   @IsOptional()
   @IsString()
   from: string;

   @IsOptional()
   @IsString()
   to: string;
}