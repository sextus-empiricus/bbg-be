import { Test, TestingModule } from '@nestjs/testing';
import { ResponseStatus } from '../../types';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
   let controller: AuthController;
   let service: AuthService;
   const mockDto = {
      email: 'test@test.test',
      password: 'test1234',
   };
   const mockAuthResponse = {
      status: ResponseStatus.success,
      tokens: {
         accessToken: 'access-token',
         refreshToken: 'refresh-token',
      },
   };
   const mockPayload = {
      sub: 'id1234',
      email: 'test@test.test',
      iat: 123,
      exp: 1234,
      refreshToken: 'refresh-token',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [
            AuthService,
            {
               provide: AuthService,
               useValue: {
                  signupLocal: jest.fn().mockResolvedValue(mockAuthResponse),
                  signinLocal: jest.fn().mockResolvedValue(mockAuthResponse),
                  logout: jest.fn(),
                  refreshTokens: jest.fn().mockResolvedValue(mockAuthResponse),
               },
            },
         ],
      }).compile();

      controller = module.get<AuthController>(AuthController);
      service = module.get<AuthService>(AuthService);
   });

   it('AuthController should be defined', () => {
      expect(controller).toBeDefined();
   });
   it('AuthService should be defined', () => {
      expect(service).toBeDefined();
   });
   describe('signupLocal', () => {
      it('should return `AuthResponse`', async () => {
         expect(await controller.signupLocal(mockDto)).toStrictEqual({
            status: ResponseStatus.success,
            tokens: {
               accessToken: expect.any(String),
               refreshToken: expect.any(String),
            },
         });
      });
      it('should pass to `authService.signupLocal` a proper dto', async () => {
         const spy = jest.spyOn(service, 'signupLocal');
         await controller.signupLocal(mockDto);
         expect(spy).toBeCalledWith(mockDto);
      });
   });
   describe('signinLocal', () => {
      it('should return `AuthResponse`', async () => {
         expect(await controller.signinLocal(mockDto)).toStrictEqual({
            status: ResponseStatus.success,
            tokens: {
               accessToken: expect.any(String),
               refreshToken: expect.any(String),
            },
         });
      });
      it('should pass to `authService.signinLocal` a proper dto', async () => {
         const spy = jest.spyOn(service, 'signinLocal');
         await controller.signinLocal(mockDto);
         expect(spy).toBeCalledWith(mockDto);
      });
   });
   describe('logout', () => {
      it('should pass to `authService.logout` a proper id', async () => {
         const mockIdGotFromDecorator = 'test1234';
         await controller.logout(mockIdGotFromDecorator);
         const spy = jest.spyOn(service, 'logout');
         expect(spy).toBeCalledWith(mockIdGotFromDecorator);
      });
   });
   describe('refreshTokens', () => {
      it('should return `AuthResponse`', async () => {
         expect(await controller.refreshTokens(mockPayload)).toStrictEqual({
            status: ResponseStatus.success,
            tokens: {
               accessToken: expect.any(String),
               refreshToken: expect.any(String),
            },
         });
      });
      it('should pass to `authService.refreshToknes` a proper params', async () => {
         const spy = jest.spyOn(service, 'refreshTokens');
         await controller.refreshTokens(mockPayload);
         expect(spy).toBeCalledWith(mockPayload.sub, mockPayload.refreshToken);
      });
   });
});
