CREATE TYPE "SensorAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "SensorAccessRequest" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SensorAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SensorAccessRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SensorAccessRequest_sensorId_userId_key" ON "SensorAccessRequest"("sensorId", "userId");
CREATE INDEX "SensorAccessRequest_status_idx" ON "SensorAccessRequest"("status");
CREATE INDEX "SensorAccessRequest_userId_idx" ON "SensorAccessRequest"("userId");

ALTER TABLE "SensorAccessRequest" ADD CONSTRAINT "SensorAccessRequest_sensorId_fkey"
FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SensorAccessRequest" ADD CONSTRAINT "SensorAccessRequest_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
