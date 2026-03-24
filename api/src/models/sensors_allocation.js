import Sequelize from "sequelize";
export default function sensors_allocation(sequelize, DataTypes) {
  return sequelize.define('sensors_allocation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sensor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id'
      },
      unique: "unique_sensor_usuario"
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      },
      unique: "unique_sensor_usuario"
    }
  }, {
    sequelize,
    tableName: 'sensors_allocation',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "sensors_allocation_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_sensor_usuario",
        unique: true,
        fields: [
          { name: "sensor_id" },
          { name: "id_usuario" },
        ]
      },
    ]
  });
};
