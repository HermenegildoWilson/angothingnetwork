import http from "http";

import env from "./src/config/env.js";
import { createApp } from "./src/app.js";
import SocketIO from "./src/realtime/socket.js";
import router from "./src/index.routes.js";
import errorMiddleware from "./src/shared/middlewares/error.middleware.js";

const app = createApp();

// Inicializar socket
const server = http.createServer(app);
const io = SocketIO.initSocket(server);

// Middleware para expor io aos controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(router);
app.use(errorMiddleware);

server.listen(env.port, () => {
    console.log(`🚀 Servidor a rodar na porta ${env.port}`);
});
