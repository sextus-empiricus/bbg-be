import { TradeMinified } from './trades.interface';
import { UserCurrenciesEntity } from './trades.misc';

export interface CreateTradeResponse {
   createdTradeId: string;
}

export interface GetMyPaginatedResponse {
   results: number;
   pages: number;
   page: number;
   tradesList: TradeMinified[];
   userCurrencies: UserCurrenciesEntity[];
}

export interface GetAllTradesResponse {
   tradesList: TradeMinified[];
}

export interface GetTradeByIdResponse {
   trade: TradeMinified | null;
}

export interface UpdatedTradeResponse {
   updatedTradeId: string;
}

export interface DeleteTradeByIdResponse {
   deletedTradeId: string;
}
