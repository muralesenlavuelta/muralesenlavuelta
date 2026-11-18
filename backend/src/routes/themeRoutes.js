import express from "express";

import {
    getThemes,
    getThemeById,
    createTheme,
    updateTheme,
    deleteTheme
} from "../controllers/themeController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getThemes);
router.get("/:id", getThemeById);
router.post("/", authenticate, requireAdmin, createTheme);
router.put("/:id", authenticate, requireAdmin, updateTheme);
router.delete("/:id", authenticate, requireAdmin, deleteTheme);

export default router;