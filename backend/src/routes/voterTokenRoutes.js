import express from "express";

import {
    createVoterToken
} from "../controllers/voterTokenController.js";

const router = express.Router();

router.get("/", createVoterToken);

export default router;