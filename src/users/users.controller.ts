import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DeactivateUserPipe } from '../pipes/deactivate-user.pipe';
import { ValidateNewUserPipe } from '../pipes/validate-new-user.pipe';
import {
   CreateUserResponse,
   DeactivateUserByIdResponse,
   GetAllUsersResponse,
   GetUserByResponse,
} from '../types/users';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';

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
   getById(@Param('id') id: string): Promise<GetUserByResponse> {
      return this.usersService.getById(id);
   }

   @Delete('/:id')
   deactivateById(
      @Param('id', DeactivateUserPipe) id: string,
   ): Promise<DeactivateUserByIdResponse> {
      return this.usersService.deactivateById(id);
   }
}
