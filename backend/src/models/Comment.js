import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define(
    "Comment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        moderationStatus: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "pending"
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "users",
                key: "id"
            }
        },

        muralId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "murals",
                key: "id"
            }
        }
    },
    {
        tableName: "comments",
        timestamps: true
    }
);

export default Comment;