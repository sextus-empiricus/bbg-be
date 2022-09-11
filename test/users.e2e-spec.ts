import {
   ConflictException,
   INestApplication,
   ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DeactivateUserPipe } from '../src/pipes/deactivate-user.pipe';
import { ValidateNewUserPipe } from '../src/pipes/validate-new-user.pipe';
import { ResponseStatus } from '../src/types/api/response';
import { User } from '../src/users/entities/user.entity';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
   let app: INestApplication;

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [UsersModule],
      })
         .overrideProvider(UsersService)
         .useValue({
            create: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
               createdUserId: 'test1234',
            }),
            getAll: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
               usersList: [{} as User],
            }),
            getById: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
               user: { id: 'id1234' } as User,
            }),
            deactivateById: jest.fn().mockResolvedValue({
               status: ResponseStatus.success,
               deactivatedUserId: 'id1234',
            }),
         })
         .overridePipe(ValidateNewUserPipe)
         .useValue({
            transform: jest.fn().mockImplementation((val) => {
               const existingUser = 'existing@existing.existing';
               if (val.email === existingUser) {
                  throw new ConflictException();
               }
            }),
         })
         .overridePipe(DeactivateUserPipe)
         .useValue({
            transform: jest.fn().mockImplementation((val) => {
               const notExistingUser = 'notExistingUser';
               if (val === notExistingUser) {
                  throw new ConflictException();
               }
            }),
         })
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
      const mockBadRequestResponse = {
         statusCode: 400,
         message: expect.any(Array),
         error: 'Bad Request',
      };

      it('should create a new user', () => {
         return request(app.getHttpServer())
            .post('/users')
            .send({
               email: 'test@test.test',
               password: 'test1234',
            })
            .expect('Content-Type', /json/)
            .expect(201)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  createdUserId: expect.any(String),
               });
            });
      });
      it('incorrect email - 400 expected', () => {
         return request(app.getHttpServer())
            .post('/users')
            .send({
               email: '',
               password: 'test1234',
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponse);
            });
      });
      it('incorrect password - 400 expected', () => {
         return request(app.getHttpServer())
            .post('/users')
            .send({
               email: 'test@test.test',
               password: '',
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponse);
            });
      });
      it('user already exist - 409 expected', () => {
         return request(app.getHttpServer())
            .post('/users')
            .send({
               email: 'existing@existing.existing',
               password: 'test1234',
            })
            .expect('Content-Type', /json/)
            .expect(409);
      });
   });
   describe('(GET) /', () => {
      it('should return users list', () => {
         return request(app.getHttpServer())
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  usersList: expect.any(Array),
               });
            });
      });
   });
   describe('(GET) /:id', () => {
      it('should return user of provided id', () => {
         return request(app.getHttpServer())
            .get('/users/id1234')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  user: { id: 'id1234' } as User,
               });
            });
      });
   });
   describe('(DELETE) /:id', () => {
      it('should return user of provided id', () => {
         return request(app.getHttpServer())
            .delete('/users/id1234')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  deactivatedUserId: 'id1234',
               });
            });
      });
      it('not exisiting user - 409 expected', () => {
         return request(app.getHttpServer())
            .delete('/users/notExistingUser')
            .expect('Content-Type', /json/)
            .expect(409);
      });
   });
});
