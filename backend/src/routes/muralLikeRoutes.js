import express from "express";

import {
    getMuralLikeCount,
    likeMural,
    getMuralVoteStatus
} from "../controllers/muralLikeController.js";

const router = express.Router();

router.get("/:muralId", getMuralLikeCount);
router.post("/:muralId", likeMural);
router.get("/:muralId/votes/status", getMuralVoteStatus);

export default router;