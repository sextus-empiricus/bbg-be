import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
   GetMyPaginatedQueryInterface,
   QueryOrder,
   QuerySortBy,
} from '../../types';

export class GetMyPaginatedQuery implements GetMyPaginatedQueryInterface{
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
   page: number;

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
