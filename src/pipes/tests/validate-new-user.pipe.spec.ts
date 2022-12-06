import { ArgumentMetadata, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/entities';
import { UsersService } from '../../users/users.service';
import { ValidateNewUserPipe } from '../validate-new-user.pipe';

describe('ValidateNewUserPipe', () => {
   let pipe: ValidateNewUserPipe;
   let usersService: UsersService;
   const mockMetadata = {} as ArgumentMetadata;
   const mockDto = {
      email: 'test@test.test',
      password: 'test1234',
   };
   const mockUser = {} as User;
   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: UsersService,
               useValue: {
                  getByEmail: jest
                     .fn()
                     .mockResolvedValueOnce(null)
                     .mockResolvedValueOnce(mockUser),
               },
            },
         ],
      }).compile();

      usersService = module.get<UsersService>(UsersService);
      pipe = new ValidateNewUserPipe(usersService);
   });

   it('ValidateNewUserPipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('UsersService should be defined', () => {
      expect(usersService).toBeDefined();
   });

   describe('successful calls', () => {
      it('should return back input data', async () => {
         expect(await pipe.transform(mockDto, mockMetadata)).toStrictEqual(
            mockDto,
         );
      });
      it('should call `usersService.getByEmail` with proper data', async () => {
         const spy = jest.spyOn(usersService, 'getByEmail');
         await pipe.transform(mockDto, mockMetadata);
         expect(spy).toBeCalledWith(mockDto.email);
      });
   });
   describe('unsuccessful calls', () => {
      it('email in use - ConflictException expected', async () => {
         await pipe.transform(mockDto, mockMetadata); //ommit the first call;
         await expect(async () => {
            await pipe.transform(mockDto, mockMetadata);
         }).rejects.toThrow(ConflictException);
      });
   });
});
