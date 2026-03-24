import Sequelize from "sequelize";
export default function sensor_readings(sequelize, DataTypes) {
    return sequelize.define(
        "sensor_readings",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            sensor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "sensors",
                    key: "id",
                },
            },
            temperature: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            humidity: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            pressure: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            air_quality: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // O Sequelize gera a data e envia no INSERT
            },
        },
        {
            sequelize,
            tableName: "sensor_readings",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "idx_sensor_readings_sensor_time",
                    fields: [
                        { name: "sensor_id" },
                        { name: "created_at", order: "DESC" },
                    ],
                },
                {
                    name: "sensor_readings_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
            ],
        }
    );
}
