import api from "./api";

export const submitResponse = async (pollId, payload) => {
	const { data } = await api.post(`/responses/${pollId}`, payload);
	return data;
};

export const getResponsesByPollId = async (pollId) => {
	const { data } = await api.get(`/responses/${pollId}`);
	return data;
};
