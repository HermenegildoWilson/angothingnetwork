import SensorRepository from "./sensor.repository.js";
import SensorCache from "./sensor.cache.js";
import { getModels } from "../../config/postgresqlClient.js";
import { col, Op, where } from "sequelize";
const {
    sensor_readings: sensor_readings_model,
    sensors: sensor_model,
    sensor_location: location_model,
} = getModels();

class classSensorService {
    async registerLocation(body) {
        const {
            pais,
            provincia,
            cidade,
            latitude = 0.0,
            longitude = 0.0,
        } = body;

        // 1. Grava no PostgreSQL
        const saved = await location_model.create({
            pais: pais,
            provincia: provincia,
            cidade: cidade,
            latitude: latitude,
            longitude: longitude,
        });

        return { message: "Região registrada com sucesso!", data: saved };
    }

    async registerSensor(body) {
        const { sensor_code, id_location } = body;

        const sensor_code_exist = await sensor_model.findOne({
            where: { sensor_code: sensor_code },
            raw: true,
        });

        if (sensor_code_exist) {
            return {
                success: false,
                status: 409,
                message: "Còdigo do sensor indisponível!",
            };
        }

        const sensor_location_exist = await location_model.findOne({
            where: { id: id_location },
            raw: true,
        });

        if (!sensor_location_exist) {
            return {
                success: false,
                status: 404,
                message: "Còdigo da região inválido!",
            };
        }

        // 1. Grava no PostgreSQL
        const saved = await sensor_model.create({
            sensor_code: sensor_code,
            id_location: id_location,
        });

        return { message: "Sensor registrado com sucesso!", data: saved };
    }

    async storeSensorReading(body, req) {
        const { sensor_code, temperature, humidity, pressure, air_quality } =
            body;

        const sensor_id_exist = await sensor_model.findOne({
            attributes: {
                include: [
                    [col("sensors.sensor_code"), "sensor_code"],
                    [col("sensor_location.pais"), "pais"],
                    [col("sensor_location.provincia"), "provincia"],
                    [col("sensor_location.cidade"), "cidade"],
                    [col("sensor_location.latitude"), "latitude"],
                    [col("sensor_location.longitude"), "longitude"],
                ],
            },
            include: {
                model: location_model,
                as: "sensor_location",
                attributes: [],
            },
            where: { sensor_code: sensor_code },
            raw: true,
        });

        if (!sensor_id_exist) {
            return {
                success: false,
                status: 404,
                message: "Còdigo do sensor inválido!",
            };
        }

        const sensorReading = {
            temperature,
            humidity,
            pressure,
            air_quality,
            created_at: new Date(),
        };

        // 1. Grava no PostgreSQL
        const saved = await sensor_readings_model.create({
            sensor_id: sensor_id_exist.id,
            ...sensorReading,
        });
        const cacheReading = {
            Temperatura: sensorReading.temperature,
            Humidade: sensorReading.humidity,
            "Pressão do Ar": sensorReading.pressure,
            "Qualidade do Ar": sensorReading.air_quality,
            timestamp: sensorReading.created_at,
            sensor_code: sensor_code,
            location: {
                pais: sensor_id_exist.pais,
                provincia: sensor_id_exist.provincia,
                cidade: sensor_id_exist.cidade,
                latitude: sensor_id_exist.latitude,
                longitude: sensor_id_exist.longitude,
            },
        };

        // 2. Atualiza Redis (estado atual)
        await SensorCache.setLastReading(sensor_code, cacheReading);

        // 3. Emite evento WebSocket para salas corretas
        req.io.to(`sensor:${sensor_code}`).emit("sensor:update", cacheReading);

        return {
            message: "Leitura registrada com sucesso!",
            data: sensorReading,
        };
    }

    async getSensors({ id = null }) {
        const idCondition = id && where(col("sensors.id"), id);

        const data = await sensor_model.findAll({
            attributes: ["sensor_code", "id"],
            where: {
                [Op.and]: [idCondition],
            },
            include: [
                {
                    model: location_model,
                    as: "sensor_location",
                    attributes: ["pais", "provincia", "cidade"],
                },
            ],
            nest: true,
            raw: true,
        });

        return {
            data: data,
            message: "Dispositivos existentes",
            success: true,
        };
    }

    async getHistoryReading(sensor_code, queries) {
        const { data = new Date() } = queries;
        const response = await SensorRepository.selectHistory(
            sensor_code,
            data,
        );

        return {
            meta: {
                location: response.location,
                data: response.history[0]?.timestamp,
            },
            data: response.history,
        };
    }

    async getMetricsReading(sensor_code, queries) {
        const { from = new Date(0), to = new Date() } = queries;

        const resolution = this.getResolution(from, to);
        let dateTrunc;
        switch (resolution) {
            case "minute":
                dateTrunc = "minute";
                break;
            case "5minute":
                dateTrunc = "minute";
                break;
            case "hour":
                dateTrunc = "hour";
                break;
            case "day":
                dateTrunc = "day";
                break;
        }

        return {
            meta: {
                from,
                to,
                dateTrunc: `À cada ${dateTrunc}`,
            },
            data: await SensorRepository.selectMetrics(
                sensor_id,
                dateTrunc,
                resolution,
                from,
                to,
            ),
        };
    }

    getResolution(from, to) {
        const diffMs = new Date(to) - new Date(from);
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours <= 1) return "minute";
        if (diffHours <= 24) return "5minute";
        if (diffHours <= 168) return "hour"; // 7 dias
        return "day";
    }
}
const SensorService = new classSensorService();
export default SensorService;
