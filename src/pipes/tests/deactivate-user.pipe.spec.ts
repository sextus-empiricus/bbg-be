import { ArgumentMetadata, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeactivateUserPipe } from '../deactivate-user.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/entities/user.entity';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('DeactivateUserPipe', () => {
   let pipe: DeactivateUserPipe;
   let dataSource: DataSource;
   const mockId = 'id1234';
   const mockMetadata = {} as ArgumentMetadata;

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
                     .mockResolvedValueOnce({} as User)
                     .mockResolvedValueOnce(null)
                     .mockResolvedValueOnce({ isActive: false } as User),
               },
            },
         ],
      }).compile();

      dataSource = module.get<DataSource>(DataSource);
      pipe = new DeactivateUserPipe(dataSource);
   });
   it('DeactivateUserPipe should be defined', () => {
      expect(pipe).toBeDefined();
   });
   it('DataSource should be defined', () => {
      expect(dataSource).toBeDefined();
   });
   describe('successful calls', () => {
      it('should return id', async () => {
         expect(await pipe.transform(mockId, mockMetadata)).toBe(mockId);
      });
      it('should create queryBuilder once', async () => {
         const spy = jest.spyOn(dataSource, 'createQueryBuilder');
         await pipe.transform(mockId, mockMetadata);
         expect(spy).toBeCalledTimes(1);
      });
      it('should call ds.cqb.select with proper selection', async () => {
         const mockSelection = 'user';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'select');
         await pipe.transform(mockId, mockMetadata);
         expect(spy).toBeCalledWith(mockSelection);
      });
      it('should call ds.cqb.from with proper entity and aliasName', async () => {
         const mockAliasName = 'user';
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'from');
         await pipe.transform(mockId, mockMetadata);
         expect(spy).toBeCalledWith(User, mockAliasName);
      });
      it('should call ds.cqb.where with proper query', async () => {
         const spy = jest.spyOn(dataSource.createQueryBuilder(), 'where');
         await pipe.transform(mockId, mockMetadata);
         expect(spy).toBeCalledWith({ id: mockId });
      });
   });
   describe('unsuccessful calls', () => {
      it('user not found - ConflictException expected', async () => {
         await pipe.transform(mockId, mockMetadata); //ommit first ds call;
         await expect(async () => {
            await pipe.transform(mockId, mockMetadata);
         }).rejects.toThrow(ConflictException);
      });
      it('user already deactivated - ConflictException expected', async () => {
         await pipe.transform(mockId, mockMetadata); //ommit first ds call;
         await expect(async () => {
            await pipe.transform(mockId, mockMetadata);
         }).rejects; //ommit second ds call;
         await expect(async () => {
            await pipe.transform(mockId, mockMetadata);
         }).rejects.toThrow(ConflictException);
      });
   });
});
