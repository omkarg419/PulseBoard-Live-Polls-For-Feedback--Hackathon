import { Router } from "express";

import authMiddleware from "../../common/middleware/auth.middleware.js";
import {
	createPollController,
	deletePollController,
	getMyPollsController,
	getPollByIdController,
	publishPollController,
	updatePollController,
} from "./poll.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createPollController);
router.get("/", getMyPollsController);
router.get("/:pollId", getPollByIdController);
router.patch("/:pollId", updatePollController);
router.delete("/:pollId", deletePollController);
router.patch("/:pollId/publish", publishPollController);

export default router;
