import { SuccessResponse } from '../api/response';

export interface CreateTradeHistoryResponse extends SuccessResponse {
   createdTradeHistoryId: string;
   relatedTradeId: string;
}
