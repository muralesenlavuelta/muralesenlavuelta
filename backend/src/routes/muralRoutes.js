import express from "express";

import {
    getMurals,
    getMuralRanking,
    getMuralById,
    createMural,
    likeMural,
    unlikeMural,
    getMuralLikes,
    updateMural,
    deleteMural
} from "../controllers/muralController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

import {
    updateMuralAuthors,
    updateMuralThemes,
    updateMuralKeywords
} from "../controllers/muralRelationsController.js";

const router = express.Router();

router.get("/", getMurals);
router.get("/ranking", getMuralRanking);
router.post("/:id/like", likeMural);
router.delete("/:id/like", unlikeMural);
router.get("/:id/likes", getMuralLikes);
router.get("/:id", getMuralById);
router.post("/", authenticate, requireAdmin, createMural);
router.put("/:id", authenticate, requireAdmin, updateMural);
router.delete("/:id", authenticate, requireAdmin, deleteMural);
router.put("/:muralId/authors", authenticate, requireAdmin, updateMuralAuthors);
router.put("/:muralId/themes", authenticate, requireAdmin, updateMuralThemes);
router.put("/:muralId/keywords", authenticate, requireAdmin, updateMuralKeywords);

export default router;