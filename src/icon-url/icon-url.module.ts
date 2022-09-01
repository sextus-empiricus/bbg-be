import { Module } from '@nestjs/common';
import { IconUrlService } from './icon-url.service';
import { IconUrlController } from './icon-url.controller';

@Module({
  controllers: [IconUrlController],
  providers: [IconUrlService],
  exports: [IconUrlService]
})
export class IconUrlModule {}
