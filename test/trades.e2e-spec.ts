import * as request from 'supertest';
import {
   ConflictException,
   INestApplication,
   ValidationPipe,
} from '@nestjs/common';
import { IconUrlService } from '../src/icon-url/icon-url.service';
import { ResponseStatus } from '../src/types/api/response';
import { Test, TestingModule } from '@nestjs/testing';
import { TradeMinified } from '../src/types/trades/trade.interface';
import { TradesModule } from '../src/trades/trades.module';
import { TradesService } from '../src/trades/trades.service';
import { UsersService } from '../src/users/users.service';
import { ValidateNewUserPipe } from '../src/pipes/validate-new-user.pipe';

describe('TradesController (e2e)', () => {
   let app: INestApplication;

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [TradesModule],
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
      const incorrectDto = {
         boughtAt: '2022-12-06',
         currency: 'btc',
         boughtFor: 500,
         amount: 0.5,
      };

      it('should create new trade', () => {
         return request(app.getHttpServer())
            .post('/trades/user/user1')
            .send(correctDto)
            .expect(201)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  createdTradeId: expect.any(String),
               });
            });
      });
      it('user not exist - 409 expected', () => {
         return request(app.getHttpServer())
            .post('/trades/user/notExistingUser')
            .send(correctDto)
            .expect(409);
      });
      it('incorrect dto - 400 expected', () => {
         return request(app.getHttpServer())
            .post('/trades/user/user1')
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
