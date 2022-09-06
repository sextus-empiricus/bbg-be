import { ArgumentMetadata, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/entities/user.entity';
import { ValidateNewUserPipe } from '../validate-new-user.pipe';
import { compare } from 'bcrypt';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('ValidateNewUserPipe', () => {
   let pipe: ValidateNewUserPipe;
   let dataSource: DataSource;
   const mockMetaData = {} as ArgumentMetadata;
   const mockDto = {
      email: 'test@test.test',
      password: 'test1234',
   };

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            {
               provide: getDataSourceToken(),
               useValue: {
                  createQueryBuilder: jest.fn().mockReturnThis(),
                  select: jest.fn().mockReturnThis(),
                  from: jest.fn().mockReturnThis(),
                  where: jest.fn().mockReturnThis(),
                  getOne: jest
                     .fn()
                     .mockReturnValueOnce(null)
                     .mockResolvedValueOnce({} as User),
               },
            },
         ],
      }).compile();

      dataSource = module.get<DataSource>(DataSource);
      pipe = new ValidateNewUserPipe(dataSource);
   });

   it('ValidateNewUserPipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
   });

   describe('successful calls', () => {
      it('should create queryBuilder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await pipe.transform(mockDto, mockMetaData);
         expect(spy).toBeCalledTimes(1);
      });
      it('should call ds.cqb.select with proper selection', async () => {
         const mockSelection = 'user';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await pipe.transform(mockDto, mockMetaData);
         expect(spy).toBeCalledWith(mockSelection);
      });
      it('should call ds.cqb.from with proper entity and aliasName', async () => {
         const mockAliasName = 'user';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await pipe.transform(mockDto, mockMetaData);
         expect(spy).toBeCalledWith(User, mockAliasName);
      });
      it('should call ds.cqb.where with proper query', async () => {
         const { email } = mockDto;
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await pipe.transform(mockDto, mockMetaData);
         expect(spy).toBeCalledWith({ email });
      });
      it('should return dto with hashed password', async () => {
         const { password } = await pipe.transform(mockDto, mockMetaData);
         expect(await compare(mockDto.password, password)).toBeTruthy();
      });
   });
   describe('unsuccessful calls', () => {
      it('email in use - ConflictException expected', async () => {
         await pipe.transform(mockDto, mockMetaData); //ommit the first call;
         await expect(async () => {
            await pipe.transform(mockDto, mockMetaData);
         }).rejects.toThrow(ConflictException);
      });
   });
});
