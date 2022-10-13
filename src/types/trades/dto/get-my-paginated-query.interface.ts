export enum QuerySortBy {
   BOUGHT_AT = 'boughtAt',
   CURRENCY = 'currency',
   AMOUNT = 'amount',
   BOUGHT_FOR = 'boughtFor',
   PRICE = 'price',
}

export enum QueryOrder {
   ASC = 'asc',
   DESC = 'desc',
}

export interface GetMyPaginatedQueryInterface {
   historical?: string;
   sortBy?: string;
   order?: string;
   currency?: string;
   page?: number;
   limit?: string;
   from?: string;
   to?: string;
}
