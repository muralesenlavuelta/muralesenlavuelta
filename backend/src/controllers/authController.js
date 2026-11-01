import {
    registerUserService,
    loginUserService
} from "../services/authService.js";

export const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        if (!username || username.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "El nombre es obligatorio."
            });
        }

        if (!email || email.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "El email es obligatorio."
            });
        }

        if (!password || password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 6 caracteres."
            });
        }

        const user =
            await registerUserService({
                username,
                email,
                password
            });

        return res.status(201).json({

            success: true,

            message:"Usuario registrado correctamente.",

            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Error en registro:",
            error
        );

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email y contraseña son obligatorios."
            });
        }

        const result = await loginUserService({
            email,
            password
        });

        return res.status(200).json({

            success: true,

            message: "Inicio de sesión correcto.",

            data: result
        });

    } catch (error) {

        console.error(
            "Error en login:",
            error
        );

        return res.status(401).json({

            success: false,

            message: error.message
        });
    }
};