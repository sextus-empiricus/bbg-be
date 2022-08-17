import { IsEmail, IsString, Min, MinLength } from 'class-validator';
import { CreateUserDtoInterface } from '../../types/users/dto/create-user.interface';

export class CreateUserDto implements CreateUserDtoInterface {
   @IsString()
   @IsEmail()
   email: string;

   @IsString()
   @MinLength(6)
   password: string;
}
