import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { appConfig } from '../config/app-config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exepction.filter';

const {
   port,
   cors: { clientUrl },
} = appConfig.app;

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.enableCors({
      origin: clientUrl,
      credentials: true,
   });
   app.useGlobalFilters(new GlobalExceptionFilter());
   app.useGlobalPipes(
      new ValidationPipe({
         // disableErrorMessages: true,
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true,
      }),
   );
   await app.listen(port);
}

bootstrap();
