/*
  Warnings:

  - You are about to drop the `Sensors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SensorsAllocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SensorsReadings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SensorsAllocation" DROP CONSTRAINT "SensorsAllocation_sensorId_fkey";

-- DropForeignKey
ALTER TABLE "SensorsAllocation" DROP CONSTRAINT "SensorsAllocation_userId_fkey";

-- DropForeignKey
ALTER TABLE "SensorsReadings" DROP CONSTRAINT "SensorsReadings_sensorId_fkey";

-- DropTable
DROP TABLE "Sensors";

-- DropTable
DROP TABLE "SensorsAllocation";

-- DropTable
DROP TABLE "SensorsReadings";

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "sensor_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorAllocation" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SensorAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorReadings" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "air_quality" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SensorReadings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_sensor_code_key" ON "Sensor"("sensor_code");

-- CreateIndex
CREATE UNIQUE INDEX "SensorAllocation_sensorId_key" ON "SensorAllocation"("sensorId");

-- AddForeignKey
ALTER TABLE "SensorAllocation" ADD CONSTRAINT "SensorAllocation_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorAllocation" ADD CONSTRAINT "SensorAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorReadings" ADD CONSTRAINT "SensorReadings_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
