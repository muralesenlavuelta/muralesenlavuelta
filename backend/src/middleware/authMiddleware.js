import jwt from "jsonwebtoken";

import {
    User
} from "../models/index.js";

export const authenticate = async (
    req,
    res,
    next
) => {

    try {

        const authorization =
            req.headers.authorization;

        if (!authorization) {

            return res.status(401).json({

                success: false,

                message:
                    "Se requiere autenticación."
            });
        }

        const parts = authorization.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Formato de autorización inválido."
            });
        }

        const token = parts[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const user =
            await User.findByPk(
                decoded.id
            );

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Usuario no encontrado."
            });
        }

        if (!user.isActive) {

            return res.status(401).json({

                success: false,

                message:
                    "La cuenta está desactivada."
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Error de autenticación:",
            error
        );

        return res.status(401).json({

            success: false,

            message:
                "Token inválido o expirado."
        });
    }
};

export const requireAdmin = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Se requiere autenticación."
        });
    }

    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "No tenés permisos para realizar esta acción."
        });
    }

    next();
};