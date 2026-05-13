import axios from "axios";

import { auth } from "../firebase/firebase";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

api.interceptors.request.use(async (config) => {
	const currentUser = auth.currentUser;

	if (currentUser) {
		const token = await currentUser.getIdToken();
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default api;
