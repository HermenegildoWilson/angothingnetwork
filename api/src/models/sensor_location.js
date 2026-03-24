import Sequelize from "sequelize";
export default function sensor_location(sequelize, DataTypes) {
  return sequelize.define('sensor_location', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    provincia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sensor_location',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "sensor_location_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
