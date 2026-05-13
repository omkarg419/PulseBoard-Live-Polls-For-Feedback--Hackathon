export const APP_NAME = "PulseBoard";
export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const SOCKET_SERVER_URL =
	import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";

export const NAV_LINKS = [
	{ label: "Dashboard", to: "/dashboard" },
	{ label: "Create Poll", to: "/create-poll" },
];
