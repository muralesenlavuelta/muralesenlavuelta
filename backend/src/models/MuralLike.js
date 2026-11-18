import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralLike = sequelize.define(
    "MuralLike",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        muralId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "murals",
                key: "id"
            }
        },

        voterToken: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "mural_likes",
        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ["muralId", "voterToken"]
            }
        ]
    }
);

export default MuralLike;