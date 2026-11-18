import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralTheme = sequelize.define(
    "MuralTheme",
    {
        muralId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "murals",
                key: "id"
            }
        },

        themeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "themes",
                key: "id"
            }
        }
    },
    {
        tableName: "mural_themes",
        timestamps: false
    }
);

export default MuralTheme;