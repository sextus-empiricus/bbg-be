import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthDtoInterface } from '../../types';

export class AuthDto implements AuthDtoInterface {
   @IsEmail()
   email: string;
   @IsString()
   @MinLength(6)
   password: string;
}
