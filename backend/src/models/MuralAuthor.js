import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MuralAuthor = sequelize.define(
    "MuralAuthor",
    {
        muralId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "murals",
                key: "id"
            }
        },

        authorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "authors",
                key: "id"
            }
        }
    },
    {
        tableName: "mural_authors",
        timestamps: false
    }
);

export default MuralAuthor;