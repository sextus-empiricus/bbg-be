import { ArgumentMetadata, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { DeactivateUserPipe } from '../deactivate-user.pipe';

describe('DeactivateUserPipe', () => {
   let pipe: DeactivateUserPipe;
   let usersService: UsersService;
   const mockId = 'id1234';
   const mockMetadata = {} as ArgumentMetadata;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: UsersService,
               useValue: {
                  getById: jest
                     .fn()
                     .mockResolvedValueOnce({ user: { id: mockId } })
                     .mockResolvedValueOnce({ user: null }),
               },
            },
         ],
      }).compile();

      usersService = module.get<UsersService>(UsersService);
      pipe = new DeactivateUserPipe(usersService);
   });
   it('DeactivateUserPipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('UsersService should be defined', () => {
      expect(usersService).toBeDefined();
   });
   describe('successful calls', () => {
      it('should return id', async () => {
         expect(await pipe.transform(mockId, mockMetadata)).toBe(mockId);
      });
      it('should call `usersService.getById` with proper id', async () => {
         const spy = jest.spyOn(usersService, 'getById');
         await pipe.transform(mockId, mockMetadata);
         expect(spy).toBeCalledWith(mockId);
      });
   });
   describe('unsuccessful calls', () => {
      it('user not found - ConflictException expected', async () => {
         await pipe.transform(mockId, mockMetadata); //ommit first `usersService` call;
         await expect(async () => {
            await pipe.transform(mockId, mockMetadata);
         }).rejects.toThrow(ConflictException);
      });
   });
});
