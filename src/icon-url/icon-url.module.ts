import { Module } from '@nestjs/common';
import { ExternalApisModule } from '../external-apis/external-apis.module';
import { IconUrlService } from './icon-url.service';

@Module({
   imports: [ExternalApisModule],
   providers: [IconUrlService],
   exports: [IconUrlService],
})
export class IconUrlModule {}
