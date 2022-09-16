import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AccessTokenStrategy } from '../src/auth/strategies';
import { DummyGeneratorModule } from '../src/dummy-generator/dummy-generator.module';
import { DummyGeneratorService } from '../src/dummy-generator/dummy-generator.service';
import { IconUrlService } from '../src/icon-url/icon-url.service';
import { TradeHistoryService } from '../src/trade-history/trade-history.service';
import { TradesService } from '../src/trades/trades.service';
import { ResponseStatus } from '../src/types/api';
import { UsersService } from '../src/users/users.service';

describe('DummyGeneratorService (e2e)', () => {
   let app: INestApplication;

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [DummyGeneratorModule],
         providers: [
            AccessTokenStrategy,
            {
               provide: 'APP_GUARD',
               useValue: {
                  canActivate: (context: ExecutionContext) => {
                     const req = context.switchToHttp().getRequest();
                     req.user = { sub: 'id1234' };
                     return true;
                  },
               },
            },
         ],
      })
         .overrideProvider(DummyGeneratorService)
         .useValue({
            generateTrades: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
            }),
         })
         .overrideProvider(UsersService)
         .useValue({})
         .overrideProvider(IconUrlService)
         .useValue({})
         .overrideProvider(TradeHistoryService)
         .useValue({})
         .overrideProvider(TradesService)
         .useValue({})
         .compile();

      app = moduleFixture.createNestApplication();
      await app.init();
   });

   it('POST /dummy-generator', () => {
      const path = '/dummy-generator/trades';
      return request(app.getHttpServer())
         .post(path)
         .expect(201)
         .then((res) => {
            expect(res.body).toStrictEqual({
               status: ResponseStatus.success,
            });
         });
   });
});
