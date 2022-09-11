import { SuccessResponse } from '../api/response';
import { UserMinified } from './user';

export interface CreateUserResponse extends SuccessResponse {
   createdUserId: string;
}

export interface GetAllUsersResponse extends SuccessResponse {
   usersList: UserMinified[];
}

export interface GetUserByResponse extends SuccessResponse {
   user: UserMinified;
}

export interface DeactivateUserByIdResponse extends SuccessResponse {
   deactivatedUserId: string;
}
