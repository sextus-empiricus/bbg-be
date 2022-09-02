import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { ResponseStatus } from '../../types/api/response';

describe('UsersController', () => {
   let controller: UsersController;
   let service: UsersService;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UsersController],
         providers: [
            {
               provide: UsersService,
               useValue: {
                  create: jest.fn((dto) => ({
                     status: ResponseStatus.success,
                     createdUserId: 'test1234',
                  })),
                  getAll: jest.fn(() => ({
                     status: ResponseStatus.success,
                     usersList: [
                        {
                           id: 'test1234',
                           email: 'test@test.test',
                           password: 'test1234',
                           authToken: 'test1234',
                        },
                     ],
                  })),
                  getById: jest.fn((id) => ({
                     status: ResponseStatus.success,
                     user: {
                        id: 'test1234',
                        email: 'test@test.test',
                        password: 'test1234',
                        authToken: 'test1234',
                     },
                  })),
                  deactivateById: jest.fn((id) => ({
                     status: ResponseStatus.success,
                     deactivatedUserId: 'test1234',
                  })),
               },
            },
         ],
      }).compile();

      controller = module.get<UsersController>(UsersController);
      service = module.get<UsersService>(UsersService);
   });

   it('UsersController be defined', () => {
      expect(controller).toBeDefined();
   });
   it('UsersService be defined', () => {
      expect(service).toBeDefined();
   });

   describe('create', () => {
      const mockDto = {
         email: 'test@test.test',
         password: 'test1234',
      };
      it('should return a proper response object', async () => {
         expect(await controller.create(mockDto)).toStrictEqual({
            status: ResponseStatus.success,
            createdUserId: expect.any(String),
         });
      });
      it('should pass to UsersService a proper dto object', async () => {
         const spy = jest.spyOn(service, 'create');
         await controller.create(mockDto);
         expect(spy).toHaveBeenCalledWith(mockDto);
      });
   });
   describe('getAll', () => {
      it('should return a proper response object', async () => {
         expect(await controller.getAll()).toStrictEqual({
            status: ResponseStatus.success,
            usersList: [
               {
                  id: expect.any(String),
                  email: expect.any(String),
                  password: expect.any(String),
                  authToken: expect.any(String),
               },
            ],
         });
      });
      it('should call UsersService.getAll', async () => {
         const spy = jest.spyOn(service, 'getAll');
         await controller.getAll();
         expect(spy).toBeCalled();
      });
   });

   describe('getById', () => {
      const mockId = 'test1234';
      it('should return a proper response object', async () => {
         expect(await controller.getById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            user: {
               id: mockId,
               email: expect.any(String),
               password: expect.any(String),
               authToken: expect.any(String),
            },
         });
      });
      it('should call UsersService.getById with proper id', async () => {
         const spy = jest.spyOn(service, 'getById');
         await controller.getById(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
   describe('deactivateById', () => {
      const mockId = 'test1234';
      it('should return a proper response objcect', async () => {
         expect(await controller.deactivateById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            deactivatedUserId: 'test1234',
         });
      });
      it('should call UsersService.deactivateById with proper id', async () => {
         const spy = jest.spyOn(service, 'deactivateById');
         await controller.deactivateById(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
});
