import dotenv from "dotenv";
dotenv.config();

const env = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION,

    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION,

    register_token_secret: process.env.REGISTER_TOKEN_SECRET,
    register_token_expiration: process.env.REGISTER_TOKEN_EXPIRATION,

    cookie_expiration: process.env.COOKIE_EXPIRATION,
    node_env: process.env.NODE_ENV,

    app_url: process.env.APP_URL,
    redis_url: process.env.REDIS_URL,
};

export default env;