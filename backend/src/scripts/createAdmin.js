import bcrypt from "bcryptjs";

import sequelize from "../config/database.js";

import {
    User
} from "../models/index.js";

const createAdmin = async () => {

    try {

        await sequelize.authenticate();

        console.log(
            "Base de datos conectada."
        );

        const username =
            process.env.ADMIN_NAME;

        const email =
            process.env.ADMIN_EMAIL;

        const password =
            process.env.ADMIN_PASSWORD;

        if (
            !username ||
            !email ||
            !password
        ) {

            throw new Error(
                "Faltan ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD en .env"
            );
        }

        const existingUser =
            await User.findOne({
                where: {
                    email: email
                        .trim()
                        .toLowerCase()
                }
            });

        if (existingUser) {

            throw new Error(
                "Ya existe un usuario con ese email."
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const admin =
            await User.create({

                username: username.trim(),

                email: email
                    .trim()
                    .toLowerCase(),

                password: hashedPassword,

                role: "admin",

                isActive: true
            });

        console.log(
            `Administrador creado correctamente. ID: ${admin.id}`
        );

    } catch (error) {

        console.error(
            "No se pudo crear el administrador:",
            error
        );

        process.exitCode = 1;

    } finally {

        await sequelize.close();
    }
};

createAdmin();