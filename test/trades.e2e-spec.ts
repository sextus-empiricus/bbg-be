import {
   ConflictException,
   ExecutionContext,
   INestApplication,
   ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AccessTokenStrategy } from '../src/auth/strategies';
import { IconUrlService } from '../src/icon-url/icon-url.service';
import { DeactivateUserPipe } from '../src/pipes/deactivate-user.pipe';
import { ValidateNewUserPipe } from '../src/pipes/validate-new-user.pipe';
import { TradesModule } from '../src/trades/trades.module';
import { TradesService } from '../src/trades/trades.service';
import { ResponseStatus } from '../src/types/api';
import { TradeMinified } from '../src/types/trades';
import { UsersService } from '../src/users/users.service';

describe('TradesController (e2e)', () => {
   let app: INestApplication;
   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [TradesModule],
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
         .overrideProvider(TradesService)
         .useValue({
            create: jest.fn().mockImplementation((dto, userId) => {
               if (userId === 'notExistingUser') {
                  throw new ConflictException();
               }
               return {
                  status: ResponseStatus.success,
                  createdTradeId: 'id1234',
               };
            }),
            getAll: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
               tradesList: [{} as TradeMinified],
            }),
            getById: jest.fn().mockImplementation((id) => {
               if (id === 'noExistingTrade') {
                  return {
                     status: ResponseStatus.success,
                     trade: null,
                  };
               } else {
                  return {
                     status: ResponseStatus.success,
                     trade: {} as TradeMinified,
                  };
               }
            }),
            update: jest.fn().mockImplementation((id) => ({
               status: ResponseStatus.success,
               updatedTradeId: id,
            })),
            remove: jest.fn().mockImplementation((id) => ({
               status: ResponseStatus.success,
               deletedTradeId: id,
            })),
         })
         .overrideProvider(UsersService)
         .useValue({})
         .overrideProvider(IconUrlService)
         .useValue({
            getBySymbol: jest.fn(),
         })
         .overridePipe(ValidateNewUserPipe)
         .useValue({})
         .overridePipe(DeactivateUserPipe)
         .useValue({})
         .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
         }),
      );

      await app.init();
   });

   describe('(POST) /', () => {
      const correctDto = {
         boughtAt: '2022-12-06',
         currency: 'btc',
         boughtFor: 500,
         price: 1000,
         amount: 0.5,
      };
      const { price, ...incorrectDto } = correctDto;

      it('should create new trade', () => {
         return request(app.getHttpServer())
            .post('/trades')
            .send(correctDto)
            .expect(201)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  createdTradeId: expect.any(String),
               });
            });
      });
      it('incorrect dto - 400 expected', () => {
         return request(app.getHttpServer())
            .post('/trades')
            .send(incorrectDto)
            .expect(400);
      });
   });
   describe('(GET) /', () => {
      it('should return trades list', () => {
         return request(app.getHttpServer())
            .get('/trades')
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  tradesList: expect.any(Array),
               });
            });
      });
   });
   describe('(GET) /:id', () => {
      it('should return trade of provided id', () => {
         return request(app.getHttpServer())
            .get('/trades/id1234')
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  trade: {} as TradeMinified,
               });
            });
      });
   });
   describe('(GET) /:id', () => {
      it('no existing trade `{...,trade: null} expected', () => {
         return request(app.getHttpServer())
            .get('/trades/noExistingTrade')
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  trade: null,
               });
            });
      });
   });
   describe('(PATCH) /:id', () => {
      const mockId = 'id1234';
      it('should update an existing trade', () => {
         return request(app.getHttpServer())
            .patch(`/trades/${mockId}`)
            .send({
               price: 1,
            })
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  updatedTradeId: mockId,
               });
            });
      });
   });
   describe('(DELETE) /:id', () => {
      const mockId = 'id1234';
      it('should delete an existing trade', () => {
         return request(app.getHttpServer())
            .delete(`/trades/${mockId}`)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  deletedTradeId: mockId,
               });
            });
      });
   });
});
