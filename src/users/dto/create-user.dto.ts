import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDtoInterface } from '../../types/users';

export class CreateUserDto implements CreateUserDtoInterface {
   @IsString()
   @IsEmail()
   email: string;

   @IsString()
   @MinLength(6)
   password: string;

   @IsOptional()
   @IsString()
   refreshToken?: string;
}
