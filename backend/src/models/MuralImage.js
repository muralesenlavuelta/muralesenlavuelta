import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralImage = sequelize.define(
    "MuralImage",
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

        url: {
            type: DataTypes.STRING(500),
            allowNull: false
        },

        caption: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        isPrimary: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: "mural_images",
        timestamps: true
    }
);

export default MuralImage;