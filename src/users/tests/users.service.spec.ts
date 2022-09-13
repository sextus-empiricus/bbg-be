import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ResponseStatus } from '../../types/api';
import { User } from '../entities';
import { UsersService } from '../users.service';

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
                  execute: jest.fn().mockResolvedValue({
                     identifiers: [{ id: 'test1234' }],
                  }),
                  //select:
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getOne: jest.fn().mockResolvedValue({
                     id: 'test1234',
                     email: 'test@test.test',
                     password: 'test1234',
                     refreshToken: 'test1234',
                  }),
                  getMany: jest
                     .fn()
                     .mockResolvedValueOnce([
                        {
                           id: 'test1234',
                           email: 'test1234',
                           password: 'test1234',
                           refreshToken: 'test1234',
                        },
                     ])
                     .mockResolvedValueOnce([
                        {
                           id: 'test1234',
                           email: 'test1234',
                           password: 'test1234',
                           refreshToken: 'test1234',
                           createdAt: new Date(),
                           updatedAt: new Date(),
                           isActive: false,
                        },
                     ]),
                  //update:
                  update: jest.fn().mockReturnThis(),
                  set: jest.fn().mockReturnThis(),
                  //delete:
                  delete: jest.fn().mockReturnThis(),
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
      it('should call `dataSource.into` with the User entity', async () => {
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
                  refreshToken: expect.any(String),
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
   describe('getAllDisabled', () => {
      it('should return `Users[]` object', async () => {
         const expectedResult = [
            {
               id: expect.any(String),
               email: expect.any(String),
               password: expect.any(String),
               refreshToken: expect.any(String),
               createdAt: expect.any(Date),
               updatedAt: expect.any(Date),
               isActive: false,
            },
         ];
         await service.getAllDisabled(); //ommit first call;
         expect(await service.getAllDisabled()).toStrictEqual(expectedResult);
      });
      it('should call a dataSource.select which a proper selection', async () => {
         await service.getAllDisabled(); //ommit first call;
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await service.getAllDisabled();
         expect(spy).toBeCalledWith('user');
      });
      it('should call a dataSource.from which a User entity', async () => {
         await service.getAllDisabled(); //ommit first call;
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.getAllDisabled();
         expect(spy).toBeCalledWith(User, 'user');
      });
      it('should call a dataSource.where which { isActive: false }', async () => {
         await service.getAllDisabled(); //ommit first call;
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.getAllDisabled();
         expect(spy).toBeCalledWith({ isActive: false });
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
               refreshToken: expect.any(String),
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
         expect(spy).toBeCalledWith({ id: mockId, isActive: true });
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
      it('should call dataSource.update with `User` entity', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'update');
         await service.deactivateById(mockId);
         expect(spy).toBeCalledWith(User);
      });
      it('should call dataSource.set with { isActive: false } object', async () => {
         const spy = jest.spyOn(
            dataSource.createQueryBuilder().update(),
            'set',
         );
         await service.deactivateById(mockId);
         expect(spy).toBeCalledWith({ isActive: false });
      });
      it('should call dataSource.where with provided id', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.deactivateById(mockId);
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
   describe('removeById', () => {
      it('should call ds.qbl.from with `User` entity ', async () => {
         const mockId = 'id1234';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await service.removeById(mockId);
         expect(spy).toBeCalledWith(User);
      });
      it('should call ds.qbl.where with provided id', async () => {
         const mockId = 'id1234';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await service.removeById(mockId);
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
});
