import SensorCache from "./sensor.cache.js";
import SensorService from "./sensor.service.js";

class classSensorControllers {
    registerLocation = async (req, res, next) => {
        try {
            const data = req.body;
            // Validação mínima (pode evoluir depois)
            if (!data?.pais || !data?.provincia || !data?.cidade) {
                throw new Error("Dados da região incompletos!");
            }
            const response = await SensorService.registerLocation(data, req);

            if (response?.success) {
                return res.status(response.status).json({
                    ...response,
                });
            }

            return res.status(201).json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    registerSensor = async (req, res, next) => {
        try {
            const data = req.body;
            // Validação mínima (pode evoluir depois)
            if (!data?.sensor_code || !data?.id_location) {
                throw new Error("Dados do sensor incompletos!");
            }
            const response = await SensorService.registerSensor(data, req);

            if (response?.success) {
                return res.status(response.status).json({
                    ...response,
                });
            }

            return res.status(201).json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    receiveSensorReading = async (req, res, next) => {
        try {
            const data = req.body;
            // Validação mínima (pode evoluir depois)
            if (
                !data?.sensor_code ||
                !data?.temperature ||
                !data?.humidity ||
                !data?.pressure ||
                !data?.air_quality
            ) {
                throw new Error("Dados do sensor inválidos!");
            }

            console.log(`Dados do sensor:${data?.sensor_code} recebidos...`);
            const response = await SensorService.storeSensorReading(data, req);

            if (response?.success) {
                return res.status(response.status).json({
                    ...response,
                });
            }

            return res.status(201).json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    getSensors = async (req, res, next) => {
        try {
            const { id = null } = req.query;
            const response = await SensorService.getSensors({ id: id });

            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "Sensor não encontrado",
                });
            }

            return res.status(200).json({ ...response });
        } catch (error) {
            next(error);
        }
    };

    getLastSensorReading = async (req, res, next) => {
        try {
            const { sensorId } = req.params;

            const data = await SensorCache.getLastReading(sensorId);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Sem dados para este sensor",
                });
            }

            return res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    getHistorySensorReading = async (req, res, next) => {
        try {
            const { sensorCode } = req.params;
            if (!sensorCode)
                return res
                    .status(400)
                    .json({ error: "O código do sensor é obrigatório" });

            const data = await SensorService.getHistoryReading(
                sensorCode,
                req.query,
            );

            return res.status(200).json({ success: true, ...data });
        } catch (error) {
            next(error);
        }
    };

    getMetricsSensorReading = async (req, res, next) => {
        try {
            const { sensorId } = req.params;

            if (!sensorId)
                return res
                    .status(400)
                    .json({ error: "SensorId é obrigatório" });

            const data = await SensorService.getMetricsReading(
                sensorId,
                req.query,
            );

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Sem dados para este sensor",
                });
            }

            return res
                .status(200)
                .json({ success: true, data: data.data.data, meta: data.meta });
        } catch (error) {
            next(error);
        }
    };
}

const SensorControllers = new classSensorControllers();

export default SensorControllers;
