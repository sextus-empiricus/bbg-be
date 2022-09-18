import { SuccessResponse } from '../api';
import { TradeMinified } from './trade.interface';

export interface CreateTradeResponse extends SuccessResponse {
   createdTradeId: string;
}

export interface GetAllMyResponse extends SuccessResponse {
   results: number;
   pages: number;
   page: number;
   tradesList: TradeMinified[];
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
