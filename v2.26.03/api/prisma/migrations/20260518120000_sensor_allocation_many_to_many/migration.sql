-- Allow a sensor to be allocated to multiple users, while keeping each
-- sensor/user pair unique.
DROP INDEX IF EXISTS "SensorAllocation_sensorId_key";

CREATE UNIQUE INDEX IF NOT EXISTS "SensorAllocation_sensorId_userId_key"
ON "SensorAllocation"("sensorId", "userId");
