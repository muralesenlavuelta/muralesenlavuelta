import express from "express";

import {
    getKeywords,
    getKeywordById,
    createKeyword,
    updateKeyword,
    deleteKeyword
} from "../controllers/keywordController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getKeywords);
router.get("/:id", getKeywordById);
router.post("/", authenticate, requireAdmin, createKeyword);
router.put("/:id", authenticate, requireAdmin, updateKeyword);
router.delete("/:id", authenticate, requireAdmin, deleteKeyword);

export default router;