import api from "./api";

export const createPoll = async (payload) => {
	const { data } = await api.post("/polls", payload);
	return data;
};

export const getPolls = async () => {
	const { data } = await api.get("/polls");
	return data;
};

export const getPollById = async (pollId) => {
	const { data } = await api.get(`/polls/${pollId}`);
	return data;
};

export const getPublicPollById = async (pollId) => {
	const { data } = await api.get(`/polls/public/${pollId}`);
	return data?.data ?? data;
};

export const updatePoll = async (pollId, payload) => {
	const { data } = await api.patch(`/polls/${pollId}`, payload);
	return data;
};

export const deletePoll = async (pollId) => {
	const { data } = await api.delete(`/polls/${pollId}`);
	return data;
};

export const publishPoll = async (pollId) => {
	const { data } = await api.patch(`/polls/${pollId}/publish`);
	return data;
};
