import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Mural = sequelize.define(
    "Mural",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(150),
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

        creationDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "Activo"
        },

        historicalInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "events",
                key: "id"
            }
        }
    },
    {
        tableName: "murals",
        timestamps: true
    }
);

export default Mural;