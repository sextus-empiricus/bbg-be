import { IsString } from 'class-validator';
import { CreateUserDtoInterface } from '../../types/users/dto/create-user.dto';

export class CreateUserDto implements CreateUserDtoInterface {
   @IsString()
   email: string;
   @IsString()
   password: string;
}
