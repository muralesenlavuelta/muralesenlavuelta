import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "El nombre de usuario no puede estar vacío."
                },
                len: {
                    args: [3, 50],
                    msg: "El nombre de usuario debe tener entre 3 y 50 caracteres."
                }
            }
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "El email no tiene un formato válido."
                }
            }
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        role: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "user"
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: "users",
        timestamps: true
    }
);

export default User;