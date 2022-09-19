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

export interface GetAllMyQueryObj {
   sortBy: QuerySortBy;
   order: QueryOrder;
}
