import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Keyword = sequelize.define(
    "Keyword",
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
        }
    },
    {
        tableName: "keywords",
        timestamps: true
    }
);

export default Keyword;