import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { DataSource, InsertResult } from 'typeorm';
import { User } from './entities/user.entity';
import {
   CreateUserResponse,
   DeactivateUserByIdResponse,
   GetAllUsersResponse,
   GetUserByIdResponse,
} from '../types/users/users.responses';
import { ResponseStatus } from '../types/api/response';
import { UserMinified } from '../types/users/user';

@Injectable()
export class UsersService {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   private outputFilter(users: User[]): UserMinified[] {
      return users.map((el) => {
         return {
            id: el.id,
            email: el.email,
            password: el.password,
            authToken: el.authToken,
         };
      });
   }

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
         usersList: this.outputFilter(usersList),
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
         user: this.outputFilter([user])[0],
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
