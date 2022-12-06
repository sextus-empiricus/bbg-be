import {
   ArgumentMetadata,
   ConflictException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class DeactivateUserPipe implements PipeTransform {
   constructor(private usersService: UsersService) {}

   async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
      const targetedUser = await this.usersService.getById(value);
      if (!targetedUser.user) {
         throw new ConflictException(
            `No active user found matches provided id.`,
         );
      }
      return value;
   }
}
