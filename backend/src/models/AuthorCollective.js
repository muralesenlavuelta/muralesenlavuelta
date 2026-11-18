import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AuthorCollective = sequelize.define(
    "AuthorCollective",
    {
        authorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "authors",
                key: "id"
            }
        },

        collectiveId: {
            type: DataTypes.INTEGER,
            primaryKey: true,

            references: {
                model: "collectives",
                key: "id"
            }
        }
    },
    {
        tableName: "author_collectives",
        timestamps: false
    }
);

export default AuthorCollective;