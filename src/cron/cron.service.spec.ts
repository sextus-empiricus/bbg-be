import { CronService } from './cron.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';

describe('CronService', () => {
   let service: CronService;
   let usersService: UsersService;

   const mockUserShouldNotBeDeleted = {
      id: 'id1234',
      email: 'test@test.test',
      password: 'test1234',
      authToken: '',
      trades: [],
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
   };

   const mockUserShouldBeDeleted = {
      ...mockUserShouldNotBeDeleted,
      updatedAt: new Date('2000-01-01T00:00:00'),
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            CronService,
            {
               provide: UsersService,
               useValue: {
                  getAllDisabled: jest
                     .fn()
                     .mockResolvedValueOnce([mockUserShouldNotBeDeleted])
                     .mockResolvedValueOnce([mockUserShouldBeDeleted]),
                  removeById: jest.fn(),
               },
            },
         ],
      }).compile();

      service = module.get<CronService>(CronService);
      usersService = module.get<UsersService>(UsersService);
   });

   it('CronService should be defined', () => {
      expect(service).toBeDefined();
   });
   it('UsersService should be defined', () => {
      expect(usersService).toBeDefined();
   });
   describe('deleteDeactivatedUsers', () => {
      it('should not call `userService.removeById`', async () => {
         const spy = jest.spyOn(usersService, 'removeById');
         await service.deleteDeactivatedUsers();
         expect(spy).toBeCalledTimes(0);
      });
      it('should call `userService.getAllDisabled`', async () => {
         const spy = jest.spyOn(usersService, 'getAllDisabled');
         await service.deleteDeactivatedUsers();
         expect(spy).toBeCalled();
      });
      it('should call `userService.removeById`', async () => {
         await service.deleteDeactivatedUsers(); //ommit first mock of resolved val;
         const spy = jest.spyOn(usersService, 'removeById');
         await service.deleteDeactivatedUsers();
         expect(spy).toBeCalledWith(mockUserShouldBeDeleted.id);
      });
   });
});
