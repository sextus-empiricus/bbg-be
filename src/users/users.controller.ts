import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import {
   CreateUserResponse,
   DeactivateUserByIdResponse,
   GetAllUsersResponse,
   GetUserByIdResponse,
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
   getById(@Param('id') id: string): Promise<GetUserByIdResponse> {
      return this.usersService.getById(id);
   }

   @Delete(':id')
   deactivateById(
      @Param('id', DeactivateUserPipe) id: string,
   ): Promise<DeactivateUserByIdResponse> {
      return this.usersService.deactivateById(id);
   }
}
