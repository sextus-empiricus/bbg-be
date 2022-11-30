export const appConfig = {
   app: {
      development: true,
      port: 0,
      cors: {
         clientUrl: ''
      }
   },
   typeorm: {
      host: '',
      port: 0,
      username: '',
      password: '',
      database: '',
   },
   externalApis: {
      coinMarketCap: {
         getIconUrl: '',
         authHeader: {
            'X-CMC_PRO_API_KEY': '',
         },
      },
      coinGecko: {
         coinsUrl: '',
      },
   },

   jwt: {
      access: {
         secretOrKey: '',
      },
      refresh: {
         secretOrKey: '',
      },
   },
};
