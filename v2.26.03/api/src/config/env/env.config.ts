import { getLocalIp } from '@/common/utils/getLocalIp';

export default () => {
  const isDev = process.env.NODE_ENV === 'development';
  const localIp = isDev ? getLocalIp() : null;

  const apiPort = parseInt(process.env.API_PORT!);
  const apiHost = process.env.API_HOST;

  const appUrl = process.env.APP_URL;

  return {
    api: {
      env: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL,
      port: apiPort,
      host: apiHost,
      url: isDev ? `http://${localIp}:${apiPort}` : `https://${apiHost}`,
      isDev: isDev,
    },

    app: {
      url: isDev ? `http://${localIp}:${5173}` : `https://${appUrl}`,
    },

    database: {
      url: process.env.DATABASE_URL,
    },

    mail: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },

    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_IN,
    },
    cookie: {
      refreshName: process.env.REFRESH_COOKIE_NAME,
    },
  };
};
