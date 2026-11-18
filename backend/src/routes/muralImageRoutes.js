import express from "express";

import {
    getMuralImages,
    createMuralImage,
    deleteMuralImage
} from "../controllers/muralImageController.js";

import {
    authenticate,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:muralId/images", getMuralImages);
router.post("/:muralId/images", authenticate, requireAdmin, createMuralImage);
router.delete("/:muralId/images/:imageId", authenticate, requireAdmin, deleteMuralImage);

export default router;