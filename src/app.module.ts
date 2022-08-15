import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from '../config/app-config';
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
         logging: true,
         synchronize: true,
      }),
      UsersModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {
}
