-- CreateTable
CREATE TABLE "sensor_location" (
    "id" SERIAL NOT NULL,
    "pais" VARCHAR(100),
    "provincia" VARCHAR(100),
    "cidade" VARCHAR(100),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "sensor_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" BIGSERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "temperature" REAL,
    "humidity" REAL,
    "pressure" REAL,
    "air_quality" REAL,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" SERIAL NOT NULL,
    "sensor_code" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id_location" INTEGER NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors_allocation" (
    "id" SERIAL NOT NULL,
    "sensor_id" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensors_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "role" VARCHAR(40) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" VARCHAR(1000) NOT NULL,
    "telefone" VARCHAR(15),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_sensor_readings_sensor_time" ON "sensor_readings"("sensor_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "sensors_sensor_code_key" ON "sensors"("sensor_code");

-- CreateIndex
CREATE UNIQUE INDEX "unique_sensor_usuario" ON "sensors_allocation"("sensor_id", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "fk_reading_sensor" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "fk_location_sensor" FOREIGN KEY ("id_location") REFERENCES "sensor_location"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sensors_allocation" ADD CONSTRAINT "fk_alloc_sensor" FOREIGN KEY ("sensor_id") REFERENCES "sensors"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sensors_allocation" ADD CONSTRAINT "fk_alloc_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "fk_token_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
