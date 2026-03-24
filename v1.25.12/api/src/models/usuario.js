import Sequelize from "sequelize";
export default function usuario(sequelize, DataTypes) {
    return sequelize.define(
        "usuario",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: "usuario_email_key",
            },
            senha: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            telefone: {
                type: DataTypes.STRING(15),
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
            tableName: "usuario",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "usuario_email_key",
                    unique: true,
                    fields: [{ name: "email" }],
                },
                {
                    name: "usuario_pkey",
                    unique: true,
                    fields: [{ name: "id" }],
                },
            ],
        }
    );
}
