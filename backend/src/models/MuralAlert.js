import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralAlert = sequelize.define(
    "MuralAlert",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },

        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "pending"
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "users",
                key: "id"
            }
        },

        muralId: {
            type: DataTypes.INTEGER,
            allowNull: true,

            references: {
                model: "murals",
                key: "id"
            }
        },

        muralName: {
            type: DataTypes.STRING(150),
            allowNull: true
        },

    },
    {
        tableName: "mural_alerts",
        timestamps: true
    }
);

export default MuralAlert;