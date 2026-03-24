import AuthMiddleware from "../../shared/middlewares/auth.middleware.js";
import SensorControllers from "./sensor.controller.js";

import { Router } from "express";
const sensorsRouter = Router();

sensorsRouter.post("/register/location", SensorControllers.registerLocation);

sensorsRouter.post("/register/sensor", 
    // AuthMiddleware.authanticateAccess,
    // AuthMiddleware.verifyRole(["admin"]),
    SensorControllers.registerSensor
);

sensorsRouter.post("/register/reading", SensorControllers.receiveSensorReading);

sensorsRouter.get(
    "/sensors",
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin"]),
    SensorControllers.getSensors
);

sensorsRouter.get(
    "/:sensorCode/last",
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin"]),
    SensorControllers.getLastSensorReading
);

sensorsRouter.get(
    "/:sensorCode/history",
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin", "visitor"]),
    SensorControllers.getHistorySensorReading
);

sensorsRouter.get(
    "/:sensorCode/metrics",
    AuthMiddleware.authanticateAccess,
    AuthMiddleware.verifyRole(["admin", "visitor"]),
    SensorControllers.getMetricsSensorReading
);

export default sensorsRouter;
