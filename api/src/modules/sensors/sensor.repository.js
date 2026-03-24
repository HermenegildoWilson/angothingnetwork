import { Op, fn, col, literal, QueryTypes, where } from "sequelize";
import { getModels } from "../../config/postgresqlClient.js";
const {
    sensor_readings: sensor_readings_model,
    sensors: sensor_model,
    sensor_location: location_model,
} = getModels();

const SensorRepository = {
    async selectHistory(sensor_code, data) {
        try {
            const sensor = await sensor_model.findOne({
                attributes: {
                    include: [
                        [col("sensors.sensor_code"), "sensor_code"],
                        [col("sensor_location.pais"), "pais"],
                        [
                            col("sensor_location.provincia"),
                            "provincia",
                        ],
                        [col("sensor_location.cidade"), "cidade"],
                        [
                            col("sensor_location.latitude"),
                            "latitude",
                        ],
                        [
                            col("sensor_location.longitude"),
                            "longitude",
                        ],
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

            const history = await sensor_readings_model.findAll({
                attributes: [
                    ["temperature", "Temperatura"],
                    ["humidity", "Humidade"],
                    ["pressure", "Pressão do Ar"],
                    ["air_quality", "Qualidade do Ar"],
                    ["created_at", "timestamp"],
                ],
                where: {
                    [Op.and]: [
                        where(col("created_at"), {
                            [Op.between]: [new Date(data), new Date()],
                        }),
                        where(col("sensor_id"), sensor.id),
                    ],
                },
                raw: true,
            });

            return { history, location: sensor };
        } catch (error) {
            console.error("ERRO DETALHADO DO POSTGRES:", error.parent); // Isso mostrará o erro real do SQL
            console.error("ERRO DE VALIDAÇÃO:", error.errors); // Caso seja erro do Sequelize
            throw error;
        }
    },

    async selectMetrics(sensor_id, dateTrunc, resolution, from, to) {
        try {
            const query = `
    SELECT
      ${
          resolution === "5minute"
              ? "DATE_TRUNC('minute', created_at) - INTERVAL '1 minute' * (EXTRACT(MINUTE FROM created_at)::int % 5)"
              : `DATE_TRUNC('${dateTrunc}', created_at)`
      } AS period,
        ROUND(AVG("temperature")::numeric, 2) AS "Temperatura",
        ROUND(AVG("humidity")::numeric, 2) AS "Humidade",
        ROUND(AVG("air_quality")::numeric, 2) AS "Qualidade do Ar",
        ROUND(AVG("pressure")::numeric, 2) AS "Pressao do Ar"sensor_readings_model
    WHERE sensor_id = 'esp32_01'
    AND created_at BETWEEN '2025-12-01' AND '2025-12-19'
    GROUP BY period
    ORDER BY period;`;

            const data = await sequelize.query(query, {
                replacements: { sensor_id, from, to },
                type: QueryTypes.SELECT,
            });

            return {
                points: data.length,
                data,
            };
        } catch (error) {
            console.error("ERRO DETALHADO DO POSTGRES:", error.parent); // Isso mostrará o erro real do SQL
            console.error("ERRO DE VALIDAÇÃO:", error.errors); // Caso seja erro do Sequelize
            throw error;
        }
    },
};

export default SensorRepository;
