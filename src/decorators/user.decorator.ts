import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const UserObject = createParamDecorator(
   async (data: any, ctx: ExecutionContext): Promise<User> => {
      const request = ctx.switchToHttp().getRequest();
      const id = request.params.userId;
      return await User.findOne({ where: { id } });
   },
);
