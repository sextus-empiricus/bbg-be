import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { appConfig } from '../src/config/app-config';
import { AccessTokenGuard, RefreshTokenGuard } from '../src/guards';
import { ResponseStatus } from '../src/types';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';

const { secretOrKey: secretAccess } = appConfig.jwt.access;
const { secretOrKey: secretRefresh } = appConfig.jwt.refresh;

describe('AuthController (e2e)', () => {
   let app: INestApplication;
   let accessToken: string;
   let refreshToken: string;
   let refreshTokenHash: string;
   const mockDto = {
      email: 'test@test.test',
      password: 'test1234',
   };
   const mockBadRequestResponseExpected = {
      statusCode: 400,
      message: expect.any(Array),
      error: 'Bad Request',
   };

   beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AuthModule, UsersModule],
         providers: [
            {
               provide: 'APP_GUARD',
               useClass: AccessTokenGuard,
            },
         ],
      })
         .overrideProvider(UsersService)
         .useValue({
            create: jest.fn().mockResolvedValue({ createdUserId: 'id1234' }),
            update: jest.fn(),
            getByEmail: jest.fn().mockImplementation((id) => {
               const password =
                  '$2a$12$frHk1XlaNmZ8R/mX80JDwOWlkrARlh/DAN2NrrUetv8Gzu0x5uXE.'; // = 'test1234';

               if (id === mockDto.email)
                  return {
                     password,
                  };
               return null;
            }),
            getById: jest.fn().mockResolvedValue({
               user: {
                  id: 'id1234',
                  email: 'test@test.test',
                  refreshToken: refreshTokenHash,
               },
            }),
         })
         .overrideGuard(RefreshTokenGuard)
         .useClass(RefreshTokenGuard)
         .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
         }),
      );
      const payload = {
         sub: 'id1234',
         email: 'test@test.test',
      };
      const options = { secret: secretAccess, expiresIn: 60 };
      accessToken = await new JwtService().signAsync(payload, options);
      refreshToken = await new JwtService().signAsync(payload, {
         ...options,
         secret: secretRefresh,
      });
      refreshTokenHash = await hash(accessToken, 12);
      await app.init();
   });

   describe('(POST) /local/signup', () => {
      const path = '/auth/local/signup';
      it('should create a new user', () => {
         return request(app.getHttpServer())
            .post(path)
            .send(mockDto)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  tokens: {
                     accessToken: expect.any(String),
                     refreshToken: expect.any(String),
                  },
               });
            });
      });
      it('incorrect email - 400 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .send({ ...mockDto, email: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponseExpected);
            });
      });
      it('incorrect password - 400 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .send({ ...mockDto, password: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponseExpected);
            });
      });
   });
   describe('(POST) /local/singin', () => {
      const path = '/auth/local/signin';
      it('should login a user', () => {
         return request(app.getHttpServer())
            .post(path)
            .send(mockDto)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  tokens: {
                     accessToken: expect.any(String),
                     refreshToken: expect.any(String),
                  },
               });
            });
      });
      it('incorrect password - 400 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .send({ ...mockDto, password: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponseExpected);
            });
      });
      it('incorrect email - 400 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .send({ ...mockDto, email: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => {
               expect(res.body).toStrictEqual(mockBadRequestResponseExpected);
            });
      });
   });
   describe('logout', () => {
      const path = '/auth/logout';
      it('unauthenticated - 403 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .expect('Content-Type', /json/)
            .expect(401);
      });
      it('should logout a user', () => {
         return request(app.getHttpServer())
            .post(path)
            .set('Authorization', 'Bearer ' + accessToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
               });
            });
      });
   });
   describe('refresh', () => {
      const path = '/auth/refresh';
      it('unauthenticated - 403 expected', () => {
         return request(app.getHttpServer())
            .post(path)
            .expect('Content-Type', /json/)
            .expect(401);
      });
      it("should refresh user's tokens", () => {
         return request(app.getHttpServer())
            .post(path)
            .set('Authorization', 'Bearer ' + refreshToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
               expect(res.body).toStrictEqual({
                  status: ResponseStatus.success,
                  tokens: {
                     accessToken: expect.any(String),
                     refreshToken: expect.any(String),
                  },
               });
            });
      });
   });
});
