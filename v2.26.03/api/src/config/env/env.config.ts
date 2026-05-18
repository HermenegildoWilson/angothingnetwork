import { getLocalIp } from '@/common/utils/getLocalIp';

export default () => {
  const isDev = process.env.NODE_ENV === 'development';
  const localIp = isDev ? getLocalIp() : null;

  const apiPort = parseInt(process.env.API_PORT ?? process.env.PORT ?? '3000');
  const apiHost = process.env.API_HOST ?? process.env.RENDER_EXTERNAL_URL;

  const appUrl = process.env.APP_URL;
  const appDeepLinking = process.env.APP_DEEP_LINKING;
  const appPort = process.env.APP_PORT ?? '5173';
  const localAppUrl = `http://${localIp}:${appPort}`;

  return {
    api: {
      env: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL,
      port: apiPort,
      host: apiHost,
      url: isDev
        ? `http://${localIp}:${apiPort}`
        : apiHost || `http://localhost:${apiPort}`,
      isDev: isDev,
      redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
    },

    app: {
      url: isDev ? localAppUrl : appUrl,
      deepLinking: isDev
        ? (appDeepLinking ?? localAppUrl)
        : (appDeepLinking ?? appUrl),
    },

    admin: {
      email: process.env.ADMIN_EMAIL,
    },

    database: {
      url: process.env.DATABASE_URL,
    },

    mail: {
      brevoApiKey: process.env.BREVO_API_KEY,
      brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,
      brevoSenderName: process.env.BREVO_SENDER_NAME ?? 'Angothingnetwork',
    },

    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_IN,
    },
  };
};
