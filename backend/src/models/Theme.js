import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Theme = sequelize.define(
    "Theme",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "themes",
        timestamps: true
    }
);

export default Theme;