import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        organizer: {
            type: DataTypes.STRING(200),
            allowNull: true
        },

        additionalInfo: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "events",
        timestamps: true
    }
);

export default Event;