CREATE DATABASE plataforma;
\c plataforma;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  role VARCHAR(40) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha VARCHAR(1000) NOT NULL,
  telefone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_token_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id)
    ON DELETE CASCADE
);


CREATE TABLE sensor_location (
  id SERIAL PRIMARY KEY,
  pais VARCHAR(100),
  provincia VARCHAR(100),
  cidade VARCHAR(100),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);


CREATE TABLE sensors (
  id SERIAL PRIMARY KEY,
  sensor_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  id_location INTEGER NOT NULL,

  CONSTRAINT fk_location_sensor
    FOREIGN KEY (id_location)
    REFERENCES sensor_location(id)
    ON DELETE CASCADE
);


CREATE TABLE sensors_allocation (
  id SERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_alloc_sensor
    FOREIGN KEY (sensor_id)
    REFERENCES sensors(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_alloc_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_sensor_usuario
    UNIQUE (sensor_id, id_usuario)
);


CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  sensor_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  temperature REAL,
  humidity REAL,
  pressure REAL,
  air_quality REAL,

  CONSTRAINT fk_reading_sensor
    FOREIGN KEY (sensor_id)
    REFERENCES sensors(id)
    ON DELETE CASCADE
);


CREATE INDEX idx_sensor_readings_sensor_time
ON sensor_readings (sensor_id, created_at DESC);