/*
  Warnings:

  - You are about to drop the column `sensor_code` on the `Sensor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sensorCode]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sensorCode` to the `Sensor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sensor_sensor_code_key";

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "sensor_code",
ADD COLUMN     "sensorCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_sensorCode_key" ON "Sensor"("sensorCode");
