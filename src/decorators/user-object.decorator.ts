import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const UserObject = createParamDecorator(
   /*🚨It's bad idea to call db in a decorator:
   1. decorators really shouldn't be calling databases, it'll lead to crazy difficult stack traces
   2. decorator methods can't be async, so you'd need callbacks, which decorators don't really work well with
   3. querying the database really should be done in the controller or service. Just a best practice.
   Anyway use will be given by passport.
   https://bit.ly/3KKQVqX
   */
   async (data: any, ctx: ExecutionContext): Promise<User> => {
      const request = ctx.switchToHttp().getRequest();
      const id = request.params.userId;
      return await User.findOne({ where: { id } });
   },
);
