import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralKeyword = sequelize.define(
    "MuralKeyword",
    {
        muralId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "murals",
                key: "id"
            }
        },

        keywordId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "keywords",
                key: "id"
            }
        }
    },
    {
        tableName: "mural_keywords",
        timestamps: false
    }
);

export default MuralKeyword;