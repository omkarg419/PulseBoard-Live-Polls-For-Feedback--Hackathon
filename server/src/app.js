import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import pollRoutes from "./modules/poll/poll.routes.js";
import responseRoutes from "./modules/response/response.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import errorMiddleware from "./common/middleware/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || true,
		credentials: true,
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is running",
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorMiddleware);

export default app;
