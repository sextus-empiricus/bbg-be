import {
   Injectable,
   ArgumentMetadata,
   ConflictException,
   PipeTransform,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DeactivateUserPipe implements PipeTransform {
   async transform(value: string, metadata: ArgumentMetadata): Promise<void> {
      const targetUser = await User.findOne({ where: { id: value } });

      if (!targetUser) {
         throw new ConflictException(`No user found match provided id.`);
      } else if (targetUser.isActive === false) {
         throw new ConflictException(`User already deactivated.`);
      }
   }
}
