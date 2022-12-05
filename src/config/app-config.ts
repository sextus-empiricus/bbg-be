import * as dotenv from 'dotenv';
import { EnvKey, getEnv } from './app-config.utils';

dotenv.config();

export const appConfig = {
   app: {
      development: getEnv(EnvKey.NODE_ENV) !== 'production',
      port: getEnv(EnvKey.APP_PORT),
      cors: {
         clientUrl: getEnv(EnvKey.CORS_CLIENT_URL),
      },
   },
   typeorm: {
      type: 'mysql',
      host: getEnv(EnvKey.MYSQLHOST),
      port: getEnv(EnvKey.MYSQLPORT),
      username: getEnv(EnvKey.MYSQLUSER),
      password: getEnv(EnvKey.MYSQLPASSWORD),
      database: getEnv(EnvKey.MYSQLDATABASE),
      entities: ['./dist/**/*.entity{.js,.ts}'],
      bigNumberStrings: false,
      logging: false,
      synchronize: getEnv(EnvKey.NODE_ENV) !== 'production',
   },
   externalApis: {
      coinMarketCap: {
         getIconUrl: 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info',
         authHeader: {
            'X-CMC_PRO_API_KEY': getEnv(EnvKey.COINMARCETCAP_KEY),
         },
      },
      coinGecko: {
         coinsUrl: 'https://api.coingecko.com/api/v3/coins',
      },
   },
   jwt: {
      access: {
         secretOrKey: getEnv(EnvKey.JWT_SECRET_ACCESS),
      },
      refresh: {
         secretOrKey: getEnv(EnvKey.JWT_SECRET_REFRESH),
      },
   },
};
