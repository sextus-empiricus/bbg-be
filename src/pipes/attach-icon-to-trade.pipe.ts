import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { IconUrlService } from '../icon-url/icon-url.service';
import { CreateTradeDto } from '../trades/dto';

@Injectable()
export class AttachIconToTradePipe implements PipeTransform {
   constructor(private readonly iconUrlService: IconUrlService) {}

   async transform(
      createTradeDto: CreateTradeDto,
      metadata: ArgumentMetadata,
   ): Promise<any> {
      return await this.iconUrlService.attachIconUrlToTradeDto(createTradeDto);
   }
}
