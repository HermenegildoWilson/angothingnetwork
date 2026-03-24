import redisClient from "../../config/redis.js";

class classSensorCache {
    async setLastReading(sensor_code, data) {
        const key = `sensor:${sensor_code}:last`;
        await redisClient.set(key, JSON.stringify(data));
    }

    async getLastReading(sensor_code) {
        const key = `sensor:${sensor_code}:last`;

        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
}

const SensorCache = new classSensorCache();

export default SensorCache;
