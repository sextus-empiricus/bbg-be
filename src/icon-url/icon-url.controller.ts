import { Controller } from '@nestjs/common';
import { IconUrlService } from './icon-url.service';

@Controller('icon-url')
export class IconUrlController {
  constructor(private readonly iconUrlService: IconUrlService) {
  }
}
