import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalApisService } from './external-apis.service';

@Module({
   imports: [HttpModule],
   providers: [ExternalApisService],
   exports: [ExternalApisService],
})
export class ExternalApisModule {}
