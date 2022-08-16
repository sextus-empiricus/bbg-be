import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
   CreateUserResponse,
   DeactivateOneByIdResponse,
   GetAllUsersResponse,
   GetOneByIdResponse,
} from '../types/users/users.responses';
import { ValidateNewUserPipe } from '../pipes/validate-new-user.pipe';
import { DeactivateUserPipe } from '../pipes/deactivate-user.pipe';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Post('/')
   async create(
      @Body(ValidateNewUserPipe) createUserDto: CreateUserDto,
   ): Promise<CreateUserResponse> {
      return await this.usersService.create(createUserDto);
   }

   @Get('/')
   getAll(): Promise<GetAllUsersResponse> {
      return this.usersService.getAll();
   }

   @Get('/:id')
   getOneById(@Param('id') id: string): Promise<GetOneByIdResponse> {
      return this.usersService.getOneById(id);
   }

   /*
   This function sets users `isActive` field as `false`.
   Then CRON module will delete all this kind of users every X days. */
   @Delete(':id')
   deactivateOneById(
      @Param('id', DeactivateUserPipe) id: string,
   ): Promise<DeactivateOneByIdResponse> {
      return this.usersService.deactivateOneById(id);
   }
}
