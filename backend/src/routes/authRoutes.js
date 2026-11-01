import express from "express";

import {
    register,
    login
} from "../controllers/authController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/me",
    authenticate,
    (req, res) => {

        return res.status(200).json({

            success: true,

            data: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);

router.get(
    "/admin-test",
    authenticate,
    requireAdmin,
    (req, res) => {

        return res.status(200).json({
            success: true,
            message: "Tenés permisos de administrador."
        });
    }
);

export default router;