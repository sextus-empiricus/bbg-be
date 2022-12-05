export enum EnvKey {
   NODE_ENV = 'NODE_ENV',
   PORT = 'PORT',
   CORS_CLIENT_URL = 'CORS_CLIENT_URL',

   MYSQLDATABASE = 'MYSQLDATABASE',
   MYSQLHOST = 'MYSQLHOST',
   MYSQLPORT = 'MYSQLPORT',
   MYSQLPASSWORD = 'MYSQLPASSWORD',
   MYSQLUSER = 'MYSQLUSER',

   COINMARCETCAP_KEY = 'COINMARCETCAP_KEY',

   JWT_SECRET_ACCESS = 'JWT_SECRET_ACCESS',
   JWT_SECRET_REFRESH = 'JWT_SECRET_REFRESH',
}

export const getEnv = (key: EnvKey): string => {
   return process.env[key];
};
