import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from '../config/app-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { DummyGeneratorModule } from './dummy-generator/dummy-generator.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import { AccessTokenGuard } from './guards';
import { IconUrlModule } from './icon-url/icon-url.module';
import { TradeHistoryModule } from './trade-history/trade-history.module';
import { TradesModule } from './trades/trades.module';
import { UsersModule } from './users/users.module';

const { host, port, username, password, database } = appConfig.typeorm;

@Module({
   imports: [
      TypeOrmModule.forRoot({
         type: 'mysql',
         host,
         port,
         username,
         password,
         database,
         entities: ['./dist/**/*.entity{.js,.ts}'],
         bigNumberStrings: false,
         logging: false,
         synchronize: true,
      }),
      AuthModule,
      CronModule,
      IconUrlModule,
      TradeHistoryModule,
      TradesModule,
      UsersModule,
      DummyGeneratorModule,
      ExternalApisModule,
   ],
   controllers: [AppController],
   providers: [
      AppService,
      {
         provide: 'APP_GUARD',
         useClass: AccessTokenGuard,
      },
   ],
})
export class AppModule {}
