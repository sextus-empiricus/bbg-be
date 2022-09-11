import {
   ArgumentMetadata,
   ConflictException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ValidateNewUserPipe implements PipeTransform {
   constructor(private usersService: UsersService) {}

   async transform(
      value: CreateUserDto,
      metadata: ArgumentMetadata,
   ): Promise<CreateUserDto> {
      const targetUser = await this.usersService.getByEmail(value.email);

      if (targetUser) {
         throw new ConflictException('Provided email address is already used.');
      }

      return value;
   }
}
