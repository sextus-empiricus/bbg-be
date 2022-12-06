import { PartialType } from '@nestjs/mapped-types';
import { CreateTradeHistoryDto } from './create-trade-history.dto';

export class UpdateTradeHistoryDto extends PartialType(CreateTradeHistoryDto) {}
