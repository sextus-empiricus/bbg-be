import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ResponseStatus } from '../../types/api';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
   let controller: UsersController;
   let service: UsersService;
   let dataSource: DataSource;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UsersController],
         providers: [
            {
               provide: UsersService,
               useValue: {
                  create: jest.fn().mockResolvedValue({
                     status: ResponseStatus.success,
                     createdUserId: 'test1234',
                  }),
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
                  getById: jest.fn().mockResolvedValue({
                     status: ResponseStatus.success,
                     user: {
                        id: 'test1234',
                        email: 'test@test.test',
                        password: 'test1234',
                        authToken: 'test1234',
                     },
                  }),
                  deactivateById: jest.fn().mockResolvedValue({
                     status: ResponseStatus.success,
                     deactivatedUserId: 'test1234',
                  }),
               },
            },
            {
               provide: getDataSourceToken(),
               useValue: {},
            },
         ],
      }).compile();

      controller = module.get<UsersController>(UsersController);
      service = module.get<UsersService>(UsersService);
      dataSource = module.get<DataSource>(DataSource);
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
      it('should return `CreateUserResponse` object', async () => {
         expect(await controller.create(mockDto)).toStrictEqual({
            status: ResponseStatus.success,
            createdUserId: expect.any(String),
         });
      });
      it('should pass to `UsersService` a proper dto', async () => {
         const spy = jest.spyOn(service, 'create');
         await controller.create(mockDto);
         expect(spy).toHaveBeenCalledWith(mockDto);
      });
   });
   describe('getAll', () => {
      it('should return `GetAllUsersResponse` object', async () => {
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
      it('should call `UsersService`.getAll', async () => {
         const spy = jest.spyOn(service, 'getAll');
         await controller.getAll();
         expect(spy).toBeCalled();
      });
   });

   describe('getById', () => {
      const mockId = 'test1234';
      it('should return `GetUserByIdResponse` object', async () => {
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
      it('should call `UsersService.getById` with proper id', async () => {
         const spy = jest.spyOn(service, 'getById');
         await controller.getById(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
   describe('deactivateById', () => {
      const mockId = 'test1234';
      it('should return `DeactivateUserByIdResponse` objcect', async () => {
         expect(await controller.deactivateById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            deactivatedUserId: 'test1234',
         });
      });
      it('should call `UsersService.deactivateById` with proper id', async () => {
         const spy = jest.spyOn(service, 'deactivateById');
         await controller.deactivateById(mockId);
         expect(spy).toBeCalledWith(mockId);
      });
   });
});
