import { DataTypes } from "sequelize";
import _sensor_location from "./sensor_location.js";
import _sensor_readings from "./sensor_readings.js";
import _sensors from "./sensors.js";
import _sensors_allocation from "./sensors_allocation.js";
import _tokens from "./tokens.js";
import _usuario from "./usuario.js";

export default function initModels(sequelize) {
  var sensor_location = _sensor_location(sequelize, DataTypes);
  var sensor_readings = _sensor_readings(sequelize, DataTypes);
  var sensors = _sensors(sequelize, DataTypes);
  var sensors_allocation = _sensors_allocation(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var usuario = _usuario(sequelize, DataTypes);

  sensors.belongsTo(sensor_location, { as: "sensor_location", foreignKey: "id_location"});
  sensor_location.hasMany(sensors, { as: "sensors", foreignKey: "id_location"});
  sensor_readings.belongsTo(sensors, { as: "sensor", foreignKey: "sensor_id"});
  sensors.hasMany(sensor_readings, { as: "sensor_readings", foreignKey: "sensor_id"});
  sensors_allocation.belongsTo(sensors, { as: "sensor", foreignKey: "sensor_id"});
  sensors.hasMany(sensors_allocation, { as: "sensors_allocations", foreignKey: "sensor_id"});
  sensors_allocation.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(sensors_allocation, { as: "sensors_allocations", foreignKey: "id_usuario"});
  tokens.belongsTo(usuario, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuario.hasMany(tokens, { as: "tokens", foreignKey: "id_usuario"});

  return {
    sensor_location,
    sensor_readings,
    sensors,
    sensors_allocation,
    tokens,
    usuario,
  };
}