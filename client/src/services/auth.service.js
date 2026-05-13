import api from "./api";

export const syncUser = async () => {
	const { data } = await api.post("/auth/sync-user");
	return data;
};

export const getCurrentUser = async () => {
	const { data } = await api.get("/auth/me");
	return data;
};
