import { User } from '../entities';
import { outputFilterUsers } from './outputFilter-users';

describe('users - outputFilter', () => {
   const mockUser = {
      id: 'id1234',
      email: 'test@test.test',
      isActive: true,
      password: 'test1234',
      refreshToken: '',
      createdAt: new Date(),
      updatedAt: new Date(),
   };
   const mockUserMinified = {
      id: 'id1234',
      email: 'test@test.test',
      password: 'test1234',
      refreshToken: '',
   };
   it('should return [null]', () => {
      expect(outputFilterUsers(null)).toStrictEqual([null]);
   });
   it('User[] passed should return UserMinified[]', () => {
      expect(outputFilterUsers([mockUser as User])).toStrictEqual([
         mockUserMinified,
      ]);
   });
   it('User passed should return UserMinified[]', () => {
      expect(outputFilterUsers(mockUser as User)).toStrictEqual([
         mockUserMinified,
      ]);
   });
});
