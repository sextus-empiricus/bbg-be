import { CreateTradeDto } from './create-trade.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {
}
