import {
   Injectable,
   ArgumentMetadata,
   ConflictException,
   PipeTransform,
   Inject,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class DeactivateUserPipe implements PipeTransform {
   constructor(@Inject(DataSource) private dataSource: DataSource) {}

   async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
      /*ℹCould use UsersService to get a user, but we are looking for `isActive` 
      and the service returns filterd data.*/
      const targetUser = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({id: value})
         .getOne();

      if (!targetUser) {
         throw new ConflictException(`No user found matches provided id.`);
      } else if (targetUser.isActive === false) {
         throw new ConflictException(`User already deactivated.`);
      }
      return value;
   }
}
