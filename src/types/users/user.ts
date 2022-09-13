import { User } from '../../users/entities';

export type UserMinified = Pick<
   User,
   'id' | 'email' | 'password' | 'refreshToken'
>;
