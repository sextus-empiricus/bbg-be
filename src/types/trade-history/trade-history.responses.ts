import { SuccessResponse } from '../api';

export interface CreateTradeHistoryResponse extends SuccessResponse {
   createdTradeHistoryId: string;
   relatedTradeId: string;
}

export interface UpdateTradeHistoryResponse extends SuccessResponse {
   updatedTradeHistoryId: string;
}
