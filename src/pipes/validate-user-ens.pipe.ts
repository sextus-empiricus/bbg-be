import {
   Injectable,
   ArgumentMetadata,
   ConflictException,
   PipeTransform,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ValidateUserEnsPipe implements PipeTransform {
   async transform(user: User, metadata: ArgumentMetadata): Promise<void> {
      if (user === null) {
         throw new ConflictException('No user found matches provided id.');
      }
   }
}
