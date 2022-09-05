import {
   CreateUserResponse,
   DeactivateUserByIdResponse,
   GetAllUsersResponse,
   GetUserByIdResponse,
} from '../types/users/users.responses';
import { CreateUserDto } from './dto';
import { DataSource, InsertResult } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseStatus } from '../types/api/response';
import { User } from './entities/user.entity';
import { outputFilter } from './utils/outputFilter';

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
         .getMany();
      return {
         status: ResponseStatus.success,
         usersList: outputFilter(usersList),
      };
   }

   async getById(id: string): Promise<GetUserByIdResponse> {
      const user = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ id })
         .getOne();

      return {
         status: ResponseStatus.success,
         user: outputFilter(user)[0],
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
}
