import express from "express";

import {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
} from "../controllers/authorController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", authenticate, requireAdmin, createAuthor);
router.put("/:id", authenticate, requireAdmin, updateAuthor);
router.delete("/:id", authenticate, requireAdmin, deleteAuthor);

export default router;