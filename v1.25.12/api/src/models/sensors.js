import Sequelize from "sequelize";
export default function sensors(sequelize, DataTypes) {
  return sequelize.define('sensors', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sensor_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "sensors_sensor_code_key"
    },
    id_location: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sensor_location',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'sensors',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sensors_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sensors_sensor_code_key",
        unique: true,
        fields: [
          { name: "sensor_code" },
        ]
      },
    ]
  });
};
