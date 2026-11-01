import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Collective = sequelize.define(
    "Collective",
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

        additionalInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        image: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    },
    {
        tableName: "collectives",
        timestamps: true
    }
);

export default Collective;