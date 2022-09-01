import { Module } from '@nestjs/common';
import { IconUrlService } from './icon-url.service';
import { IconUrlController } from './icon-url.controller';

@Module({
  controllers: [IconUrlController],
  providers: [IconUrlService]
})
export class IconUrlModule {}
