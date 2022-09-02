import { Module } from '@nestjs/common';
import { IconUrlService } from './icon-url.service';

@Module({
  providers: [IconUrlService],
  exports: [IconUrlService]
})
export class IconUrlModule {}
