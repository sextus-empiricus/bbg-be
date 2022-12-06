import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseStatus } from '../../types';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
   let service: AuthService;
   let usersService: UsersService;
   let jwtService: JwtService;
   const bcrypthashRegex = /^\$2[ayb]\$.{56}$/;

   const mockDto = {
      email: 'test@test.test',
      password: 'test1234',
   };
   const MockAuthResponse = {
      status: ResponseStatus.success,
      tokens: {
         accessToken: expect.any(String),
         refreshToken: expect.any(String),
      },
   };
   const mockUser = {
      id: 'id1234',
      email: 'test@test.test',
      password: '$2b$12$.HM49aPYyTsaUjwSh5PZ3.vk.MLfI4XYIQ3rLlRub9yjKWL3jkW4.',
      refreshToken:
         '$2a$12$JueLzvOn8KH5m8hQxQHgE.cdy4w6TpK8Qps9aATK.uZxDzYsQsk.6', // = 'refresh-token'
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            {
               provide: UsersService,
               useValue: {
                  create: jest.fn().mockResolvedValue({
                     createdUserId: 'id1234',
                  }),
                  update: jest.fn(),
                  getByEmail: jest
                     .fn()
                     .mockResolvedValueOnce(mockUser)
                     .mockResolvedValueOnce(null),
                  getById: jest
                     .fn()
                     .mockResolvedValueOnce({
                        user: mockUser,
                     })
                     .mockResolvedValueOnce({ user: null })
                     .mockResolvedValueOnce({
                        user: { ...mockUser, refreshToken: null },
                     }),
               },
            },
            {
               provide: JwtService,
               useValue: {
                  signAsync: jest.fn().mockResolvedValue('token'),
               },
            },
         ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      usersService = module.get<UsersService>(UsersService);
      jwtService = module.get<JwtService>(JwtService);
   });

   it('AuthService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('UsersService should be defined', () => {
      expect(usersService).toBeDefined();
   });
   it('JwtService should be defined', () => {
      expect(jwtService).toBeDefined();
   });
   describe("getting tokens, updating user's refresh token functionality", () => {
      it('should call `this.getTokens` with proper params', async () => {
         const spy = jest.spyOn(service, 'getTokens');
         await service.signupLocal(mockDto);
         const { createdUserId } = await usersService.create(mockDto);
         expect(spy).toBeCalledWith(createdUserId, mockDto.email);
      });
      it('should call `updateUserRefreshToken` with proper params', async () => {
         const spy = jest.spyOn(service, 'updateUserRefreshToken');
         const { createdUserId } = await usersService.create(mockDto);
         const tokens = await service.getTokens(createdUserId, mockDto.email);
         await service.signupLocal(mockDto);
         expect(spy).toBeCalledWith(createdUserId, tokens.refreshToken);
      });
   });
   describe('signupLocal', () => {
      it('should return `AuthResponse` object', async () => {
         expect(await service.signupLocal(mockDto)).toStrictEqual(
            MockAuthResponse,
         );
      });
      it('should call `usersService.create` with proper dto and hashed password', async () => {
         const spy = jest.spyOn(usersService, 'create');
         await service.signupLocal(mockDto);
         expect(spy).toBeCalledWith({
            ...mockDto,
            password: expect.stringMatching(bcrypthashRegex),
         });
      });
   });
   describe('signinLocal', () => {
      it('should return `AuthResponse` object', async () => {
         expect(await service.signinLocal(mockDto)).toStrictEqual(
            MockAuthResponse,
         );
      });
      it('incorret email - ForbiddenException expected', async () => {
         await service.signinLocal(mockDto); //ommit first call to get proper usersService.getByEmail() result;
         await expect(
            async () => await service.signinLocal(mockDto),
         ).rejects.toThrow(ForbiddenException);
      });
      it('incorret password - ForbiddenException expected', async () => {
         await expect(
            async () => await service.signinLocal({ ...mockDto, password: '' }),
         ).rejects.toThrow(ForbiddenException);
      });
   });
   describe('logout', () => {
      it('should return `SuccessResponse` object ', async () => {
         const mockId = 'id1234';
         expect(await service.logout(mockId)).toStrictEqual({
            status: ResponseStatus.success,
         });
      });
      it('should call `usersService.update` with proper params ', async () => {
         const mockId = 'id1234';
         const spy = jest.spyOn(usersService, 'update');
         await service.logout(mockId);
         expect(spy).toBeCalledWith(mockId, { refreshToken: null });
      });
   });

   describe('refreshTokens', () => {
      const mockUserId = 'id1234';
      const mockRefreshToken = 'refresh-token';
      it('should return `AuthResponse` object', async () => {
         expect(
            await service.refreshTokens(mockUserId, mockRefreshToken),
         ).toStrictEqual(MockAuthResponse);
      });
      it('user not found - ForbiddenException expected', async () => {
         await service.refreshTokens(mockUserId, mockRefreshToken); //ommit first call to get proper usersService.getById() result;
         await expect(
            async () =>
               await service.refreshTokens(mockUserId, mockRefreshToken),
         ).rejects.toThrow(ForbiddenException);
      });
      it('user.refreshToken is null - ForbiddenException expected', async () => {
         await service.refreshTokens(mockUserId, mockRefreshToken); //ommit first call to get proper usersService.getById() result;
         await service
            .refreshTokens(mockUserId, mockRefreshToken)
            .catch(() => {}); //ommit second call to get proper usersService.getById() result;
         await expect(
            async () =>
               await service.refreshTokens(mockUserId, mockRefreshToken),
         ).rejects.toThrow(ForbiddenException);
      });
      it('incorrect refresh token provided - ForbiddenException expected ', async () => {
         await expect(
            async () => await service.refreshTokens(mockUserId, 'incorrect'),
         ).rejects.toThrow(ForbiddenException);
      });
   });
   describe('getTokens', () => {
      const mockUserId = 'id1234';
      const mockEmail = 'test@test.test';
      it('should return `TokensObject`', async () => {
         expect(await service.getTokens(mockUserId, mockEmail)).toStrictEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
         });
      });
      it('should call `jwtService.signAsync` with proper props ', async () => {
         const spy = jest.spyOn(jwtService, 'signAsync');
         await service.getTokens(mockUserId, mockEmail);
         expect(spy).toHaveBeenNthCalledWith(
            1,
            {
               sub: mockUserId,
               email: mockEmail,
            },
            expect.any(Object),
         );
         expect(spy).toHaveBeenNthCalledWith(
            2,
            {
               sub: mockUserId,
               email: mockEmail,
            },
            expect.any(Object),
         );
      });
   });
   describe('updateUserRefreshToken', () => {
      const mockUserId = 'id1234';
      const mockRefreshToken = 'refresh-token';
      it('should call `usersService.update` with hashed refreshToken', async () => {
         const spy = jest.spyOn(usersService, 'update');
         await service.updateUserRefreshToken(mockUserId, mockRefreshToken);
         expect(spy).toBeCalledWith(mockUserId, {
            refreshToken: expect.stringMatching(bcrypthashRegex),
         });
      });
   });
});
