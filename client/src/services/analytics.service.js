import api from "./api";

export const getAnalyticsByPollId = async (pollId) => {
	const { data } = await api.get(`/analytics/${pollId}`);
	// server responses use an envelope: { success, message, data }
	// unwrap and return the inner data object (the analytics payload)
	return data.data ?? data;
};
