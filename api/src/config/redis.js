import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({ url: env.redis_url });

redisClient.on("connect", () => {
    console.log("Redis conectado");
});

redisClient.on("error", (err) => {
    console.error("Erro Redis:", err);
});

redisClient.connect().catch((err) => {
    console.error("Erro ao conectar no Redis:", err);
});

export default redisClient;
