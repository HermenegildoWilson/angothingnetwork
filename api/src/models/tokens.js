import Sequelize from "sequelize";
export default function tokens(sequelize, DataTypes) {
    return sequelize.define(
        "tokens",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            id_usuario: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "usuario",
                    key: "id",
                },
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        },
        {
            sequelize,
            tableName: "tokens",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "tokens_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
            ],
        }
    );
}
