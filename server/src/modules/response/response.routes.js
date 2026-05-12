import { Router } from "express";

import authMiddleware from "../../common/middleware/auth.middleware.js";
import {
	getResponsesForPollController,
	submitResponseController,
} from "./response.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/:pollId", submitResponseController);
router.get("/:pollId", getResponsesForPollController);

export default router;
