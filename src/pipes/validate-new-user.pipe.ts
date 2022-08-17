import {
   ArgumentMetadata,
   ConflictException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class ValidateNewUserPipe implements PipeTransform {
   async transform(
      value: any,
      metadata: ArgumentMetadata,
   ): Promise<CreateUserDto> {
      const targetUser = await User.findOne({ where: { email: value.email } });
      if (targetUser) {
         throw new ConflictException('Provided email address is already used.');
      } else {
         return {
            email: value.email,
            password: await hash(value.password, 12),
         };
      }
   }
}
