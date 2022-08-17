import { SuccessResponse } from '../api/response';
import { TradeMinified } from './trade';

export interface CreateTradeResponse extends SuccessResponse {
   createdTradeId: string;
}

export interface GetAllTradesResponse extends SuccessResponse {
   tradesList: TradeMinified[];
}

export interface GetTradeByIdResponse extends SuccessResponse {
   trade: TradeMinified;
}

export interface UpdatedTradeResponse extends SuccessResponse {
   updatedTradeId: string;
}

export interface DeleteTradeByIdResponse extends SuccessResponse {
   deletedTradeId: string;
}
