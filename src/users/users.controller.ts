import { Controller, Delete, Get } from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { DeactivateUserByIdResponse, GetUserByResponse } from '../types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Get('/')
   getMe(@GetCurrentUser('sub') id: string): Promise<GetUserByResponse> {
      return this.usersService.getById(id);
   }

   @Delete('/')
   deactivateMe(
      @GetCurrentUser('sub') id: string,
   ): Promise<DeactivateUserByIdResponse> {
      return this.usersService.deactivateById(id);
   }

   // @Post('/')
   // async create(
   //    @Body(ValidateNewUserPipe) createUserDto: CreateUserDto,
   // ): Promise<CreateUserResponse> {
   //    return await this.usersService.create(createUserDto);
   // }

   // @Get('/')
   // getAll(): Promise<GetAllUsersResponse> {
   //    return this.usersService.getAll();
   // }
}
