import { SuccessResponse } from '../api';
import { TokensObject } from './tokens-object.interface';

export interface AuthResponse extends SuccessResponse {
   tokens: TokensObject;
}