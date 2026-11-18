import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralAlertReport = sequelize.define(
    "MuralAlertReport",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        alertId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mural_alerts",
                key: "id"
            }
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "mural_alert_reports",
        timestamps: true
    }
);

export default MuralAlertReport;
