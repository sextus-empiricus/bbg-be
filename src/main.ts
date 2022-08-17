import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exepction.filter';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from '../config/app-config';

const { port } = appConfig.app;

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalFilters(new GlobalExceptionFilter());
   app.useGlobalPipes(new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
   }));
   await app.listen(port);
}

bootstrap();
