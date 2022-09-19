import { Controller, Delete } from '@nestjs/common';
import { GetCurrentUser } from '../decorators';
import { DeactivateUserByIdResponse } from '../types/users';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {}

   @Delete('/me')
   deactivateById(
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

   // @Get('/:id')
   // getById(@Param('id') id: string): Promise<GetUserByResponse> {
   //    return this.usersService.getById(id);
   // }
}
