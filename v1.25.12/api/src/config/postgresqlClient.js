import Sequelize from "sequelize";
import initModels from "../models/init-models.js";
import env from "./env.js";

const sequelize = new Sequelize(env.database_url, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // ignora certificado autoassinado
        },
    },
    logging: false, // opcional
});

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("📦 Conectado ao PostgreSQL com sucesso.");
    } catch (error) {
        console.error("❌ Erro na conexão com o banco:", error.message);
        console.error("❌ Erro na conexão com o banco:", error);
        process.exit(1);
    }
}

export function getModels() {
    return initModels(sequelize);
}

//npx sequelize-auto -o "./models" -d plataforma -h localhost -u postgres -p 5432 -x senha -e postgres --schema public