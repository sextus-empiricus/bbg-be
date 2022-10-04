import { UserMinified } from '../../types/users';
import { User } from '../entities';

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
            refreshToken: el.refreshToken,
         };
      });
   }
   /*If users is an object:*/
   const { createdAt, updatedAt, password, isActive, ...user } = users;
   return [user];
};
