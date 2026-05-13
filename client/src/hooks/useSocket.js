import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { SOCKET_SERVER_URL } from "../utils/constants";

const useSocket = ({
	pollId,
	enabled = true,
	onResponseUpdate,
	onAnalyticsUpdate,
	onPollPublished,
} = {}) => {
	const socketRef = useRef(null);
	const handlersRef = useRef({
		onResponseUpdate,
		onAnalyticsUpdate,
		onPollPublished,
	});
	const [connected, setConnected] = useState(false);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		handlersRef.current = {
			onResponseUpdate,
			onAnalyticsUpdate,
			onPollPublished,
		};
	}, [onResponseUpdate, onAnalyticsUpdate, onPollPublished]);

	useEffect(() => {
		if (!enabled) {
			return undefined;
		}

		const socket = io(SOCKET_SERVER_URL, {
			withCredentials: true,
			transports: ["websocket"],
		});

		socketRef.current = socket;
		setSocket(socket);

		const handleConnect = () => setConnected(true);
		const handleDisconnect = () => setConnected(false);
		const handleResponseUpdate = (payload) => {
			handlersRef.current.onResponseUpdate?.(payload);
		};
		const handleAnalyticsUpdate = (payload) => {
			handlersRef.current.onAnalyticsUpdate?.(payload);
		};
		const handlePollPublished = (payload) => {
			handlersRef.current.onPollPublished?.(payload);
		};
		socket.on("connect", handleConnect);
		socket.on("disconnect", handleDisconnect);
		socket.on("response-update", handleResponseUpdate);
		socket.on("analytics-update", handleAnalyticsUpdate);
		socket.on("poll-published", handlePollPublished);

		return () => {
			if (pollId) {
				socket.emit("leave-poll", pollId);
			}

			socket.off("connect", handleConnect);
			socket.off("disconnect", handleDisconnect);
			socket.off("response-update", handleResponseUpdate);
			socket.off("analytics-update", handleAnalyticsUpdate);
			socket.off("poll-published", handlePollPublished);
			socket.disconnect();
			socketRef.current = null;
			setConnected(false);
			setSocket(null);
		};
	}, [enabled, pollId]);

	useEffect(() => {
		const socketInstance = socketRef.current;

		if (!socketInstance || !pollId) {
			return undefined;
		}

		socketInstance.emit("join-poll", pollId);

		return () => {
			socketInstance.emit("leave-poll", pollId);
		};
	}, [pollId, socket]);

	return {
		connected,
		socket,
	};
};

export default useSocket;
