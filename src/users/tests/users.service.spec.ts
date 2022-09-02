import { DataSource } from 'typeorm';
import { ResponseStatus } from '../../types/api/response';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('UsersService', () => {
   let service: UsersService;
   let dataSource: DataSource;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UsersService,
            {
               provide: getDataSourceToken(),
               useValue: {
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  //insert:
                  insert: jest.fn().mockReturnThis(),
                  into: jest.fn().mockReturnThis(),
                  values: jest.fn().mockReturnThis(),
                  execute: jest.fn((dto) => ({
                     identifiers: [{ id: 'test1234' }],
                  })),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getOne: jest.fn((id) => ({
                     id: 'test1234',
                     email: 'test@test.test',
                     password: 'test1234',
                     authToken: 'test1234',
                  })),
                  getMany: jest.fn((symbol) => {
                     return [
                        {
                           id: 'test1234',
                           email: 'test1234',
                           password: 'test1234',
                           authToken: 'test1234',
                        },
                     ];
                  }),
                  //update:
                  update: jest.fn().mockReturnThis(),
                  set: jest.fn().mockReturnThis(),
               },
            },
         ],
      }).compile();

      service = module.get<UsersService>(UsersService);
      dataSource = module.get<DataSource>(DataSource);
   });

   it('UsersServiceshould be defined', () => {
      expect(service).toBeDefined();
   });
   it('DataSource be defined', () => {
      expect(service).toBeDefined();
   });
   describe('create', () => {
      const dtoMock = {
         email: 'test@test.test',
         password: 'test1234',
      };
      it('should return `CreateUserResponse` object', async () => {
         expect(await service.create(dtoMock)).toStrictEqual({
            status: ResponseStatus.success,
            createdUserId: expect.any(String),
         });
      });
      it('should call datasource.into with the User entity', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'into',
         );
         await service.create(dtoMock);
         expect(spy).toHaveBeenCalledWith(User);
      });
      it('should call a dataSource.value which a proper dto', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().insert(),
            'values',
         );
         await service.create(dtoMock);
         expect(spy).toHaveBeenCalledWith(dtoMock);
      });
   });
   describe('getAll', () => {
      it('should return `GetAllUsersResponse` object', async () => {
         expect(await service.getAll()).toStrictEqual({
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
      it('should call a dataSource.select which a proper selection', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getAll();
         expect(spy).toBeCalledWith('user');
      });
      it('should call a dataSource.from which a User entity', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getAll();
         expect(spy).toBeCalledWith(User, 'user');
      });
   });
   describe('getById', () => {
      const mockId = 'test1234';
      it('should return `GetUserByIdResponse` object', async () => {
         expect(await service.getById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            user: {
               id: mockId,
               email: expect.any(String),
               password: expect.any(String),
               authToken: expect.any(String),
            },
         });
      });
      it('should call a dataSource.select which `user` selection', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getById(mockId);
         expect(spy).toBeCalledWith('user');
      });
      it('should call a dataSource.from which a `User` entity', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getById(mockId);
         expect(spy).toBeCalledWith(User, 'user');
      });
      it('should call a dataSource.where which a provided id', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.getById(mockId);
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
   describe('deactivateById', () => {
      const mockId = 'test1234';
      it('should return `DeactivateUserByIdResponse` object', async () => {
         expect(await service.deactivateById(mockId)).toStrictEqual({
            status: ResponseStatus.success,
            deactivatedUserId: mockId,
         });
      });
      it('should call dataSource.update with `User` entity', async() => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'update')
         await service.deactivateById(mockId)
         expect(spy).toBeCalledWith(User)
      });
      it('should call dataSource.set with { isActive: false } object', async() => {
         const spy = jest.spyOn(dataSource.createQueryBuilder().update(), 'set')
         await service.deactivateById(mockId)
         expect(spy).toBeCalledWith({ isActive: false })
      });
      it('should call dataSource.where with provided id', async() => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where')
         await service.deactivateById(mockId)
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
});
