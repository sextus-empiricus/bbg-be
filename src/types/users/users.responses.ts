import { SuccessResponse } from '../api/response';
import { UserMinified } from './user';

export interface CreateUserResponse extends SuccessResponse {
   createdUserId: string;
}

export interface GetAllUsersResponse extends SuccessResponse {
   usersList: UserMinified[];
}

export interface GetOneByIdResponse extends SuccessResponse {
   user: UserMinified;
}

export interface DeactivateOneByIdResponse extends SuccessResponse {
   deactivatedUserId: string;
}
