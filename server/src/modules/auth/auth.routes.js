import { Router } from "express";

import authMiddleware from "../../common/middleware/auth.middleware.js";
import { me, syncUser } from "./auth.controller.js";

const router = Router();

router.post("/sync-user", authMiddleware, syncUser);
router.get("/me", authMiddleware, me);

export default router;
