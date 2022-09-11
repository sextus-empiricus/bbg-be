import { UserMinified } from '../../types/users/user';
import { User } from '../entities/user.entity';

export const outputFilterUsers = (
   users: User[] | User | null,
): UserMinified[] => {
   /*If users is a null:*/
   if (users === null) {
      return [null];
   }
   /*If users is an array:*/
   if (Array.isArray(users)) {
      return users.map((el) => {
         return {
            id: el.id,
            email: el.email,
            password: el.password,
            authToken: el.authToken,
         };
      });
   }
   /*If users is an object:*/
   const { createdAt, updatedAt, isActive, ...user } = users;
   return [user];
};
