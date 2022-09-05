import {
   ArgumentMetadata,
   ConflictException,
   Inject,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class ValidateNewUserPipe implements PipeTransform {
   constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

   async transform(
      value: any,
      metadata: ArgumentMetadata,
   ): Promise<CreateUserDto> {
      const targetUser = await this.dataSource
         .createQueryBuilder()
         .select('user')
         .from(User, 'user')
         .where({ email: value.email  })
         .getOne();
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
