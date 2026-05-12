import admin from "../config/firebase.js";
import ApiError from "../utils/api-error.js";

const authMiddleware = async (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
			return next(ApiError.unauthorized("Missing Bearer token"));
		}

		const token = authorizationHeader.split(" ")[1];
		const decoded = await admin.auth().verifyIdToken(token);

		req.user = decoded;
		return next();
	} catch (error) {
		return next(ApiError.unauthorized("Invalid or expired Firebase ID token"));
	}
};

export default authMiddleware;
