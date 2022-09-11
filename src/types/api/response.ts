export enum ResponseStatus {
   success = 'success',
   failed = 'failed',
}

export interface SuccessResponse {
   status: ResponseStatus.success;
}
