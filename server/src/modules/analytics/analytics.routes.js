import { Router } from "express";

import authMiddleware from "../../common/middleware/auth.middleware.js";
import { getAnalyticsController } from "./analytics.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/:pollId", getAnalyticsController);

export default router;
