import {
   ArgumentMetadata,
   ConflictException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ValidateUserEnsPipe implements PipeTransform {
   async transform(user: User, metadata: ArgumentMetadata): Promise<User> {
      if (user === null) {
         throw new ConflictException('No user found matches provided id.');
      }
      return user;
   }
}
