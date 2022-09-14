import { SuccessResponse } from '../api';

export interface CreateTradeHistoryResponse extends SuccessResponse {
   createdTradeHistoryId: string;
   relatedTradeId: string;
}
