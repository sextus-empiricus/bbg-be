import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { ResponseStatus } from '../types/api/response';
import {
   CreateUserResponse,
   DeactivateUserByIdResponse,
   GetAllUsersResponse,
   GetUserByIdResponse,
} from '../types/users/users.responses';
import { CreateUserDto } from './dto';
import { User } from './entities';
import { outputFilterUsers } from './utils/outputFilter-users';

@Injectable()
export class UsersService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
      const insertResult: InsertResult = await this.dataSource
         .createQueryBuilder()
         .insert()
         .into(User)
         .values(createUserDto)
         .execute();
      return {
         status: ResponseStatus.success,
         createdUserId: insertResult.identifiers[0].id,
      };
   }

   async getAll(): Promise<GetAllUsersResponse> {
      const usersList = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ isActive: true })
         .getMany();
      return {
         status: ResponseStatus.success,
         usersList: outputFilterUsers(usersList),
      };
   }

   async getAllDisabled(): Promise<User[]> {
      return await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ isActive: false })
         .getMany();
   }

   async getById(id: string): Promise<GetUserByIdResponse> {
      const user = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ id, isActive: true })
         .getOne();

      return {
         status: ResponseStatus.success,
         user: outputFilterUsers(user)[0],
      };
   }

   async deactivateById(id: string): Promise<DeactivateUserByIdResponse> {
      await this.dataSource
         .createQueryBuilder()
         .update(User)
         .set({ isActive: false })
         .where({ id })
         .execute();
      return {
         status: ResponseStatus.success,
         deactivatedUserId: id,
      };
   }

   async removeById(id: string): Promise<void> {
      await this.dataSource
         .createQueryBuilder()
         .delete()
         .from(User)
         .where({ id })
         .execute();
   }
}
