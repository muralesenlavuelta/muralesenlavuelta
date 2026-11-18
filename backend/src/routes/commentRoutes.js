import express from "express";

import {
    createComment,
    deleteComment,
    getAllComments,
    getMuralComments,
    moderateComment,
    updateComment
} from "../controllers/commentController.js";

import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, requireAdmin, getAllComments);
router.patch("/:id/moderation", authenticate, requireAdmin, moderateComment);
router.put("/:id", authenticate, updateComment);
router.delete("/:id", authenticate, deleteComment);
router.get("/mural/:muralId", getMuralComments);
router.post("/mural/:muralId", authenticate, createComment);

export default router;
