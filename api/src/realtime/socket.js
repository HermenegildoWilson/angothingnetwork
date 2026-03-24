import { Server } from "socket.io";
import env from "../config/env.js";
import  SensorCache from "../modules/sensors/sensor.cache.js";

let io;


//{ getLastReading }
class socketIO {
    initSocket(server) {
        io = new Server(server, {
            cors: {
                origin: env.app_url,
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("Socket conectado:", socket.id);

            setTimeout(() => {
                console.log("Socket ainda vivo?", socket.connected);
            }, 2000);

            socket.on("subscribe", async ({ sensors = [] }) => {
                console.log("📡 Subscribe recebido: ");

                // Salas por sensor
                sensors.forEach((sensor_code) => {
                    socket.join(`sensor:${sensor_code}`);
                });

                console.log("🟦 Salas atuais:", [...socket.rooms]);

                // Estado inicial apenas dos sensores pedidos
                const sensorStates = {};

                for (const sensor_code of sensors) {
                    const last = await SensorCache.getLastReading(sensor_code);
                    if (last) sensorStates[sensor_code] = last;
                }

                socket.emit("sensor:initial", {
                    sensors: sensorStates,
                });
            });

            socket.on("disconnect", () => {
                console.log("Socket desconectado:", socket.id);
            });
        });

        return io;
    }
}

const SocketIO = new socketIO()

export default SocketIO;
