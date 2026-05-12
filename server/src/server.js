import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./common/config/db.js";
import { setSocketIO } from "./common/config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	await connectDB();

	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_ORIGIN || true,
			credentials: true,
		},
	});

	setSocketIO(io);

	io.on("connection", (socket) => {
		socket.on("join-poll", (pollId) => {
			if (pollId) {
				socket.join(String(pollId));
			}
		});

		socket.on("leave-poll", (pollId) => {
			if (pollId) {
				socket.leave(String(pollId));
			}
		});
	});

	server.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};

startServer();
