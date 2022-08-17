import {
   Injectable,
   ArgumentMetadata,
   PipeTransform,
   BadRequestException,
   ConflictException,
} from '@nestjs/common';
import { CreateTradeDto } from '../trades/dto/create-trade.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CreateNewTradePipe implements PipeTransform {
   async transform(
      id: string,
      metadata: ArgumentMetadata,
   ): Promise<any> {

      const user = await User.findOne({ where: { id } });

      if (!user) {
         throw new ConflictException('No user found matches provided id.');
      }

      return user;
   }
}
