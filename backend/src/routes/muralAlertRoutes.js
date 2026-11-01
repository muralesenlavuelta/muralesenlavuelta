import express from "express";
import {
    createMuralAlertReport,
    createMissingMuralReport,
    getMuralAlerts,
    updateMuralAlertStatus
} from "../controllers/muralAlertController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, requireAdmin, getMuralAlerts);
router.post("/missing-murals", authenticate, createMissingMuralReport);
router.post("/murals/:muralId", authenticate, createMuralAlertReport);
router.patch("/:id/status", authenticate, requireAdmin, updateMuralAlertStatus);

export default router;
