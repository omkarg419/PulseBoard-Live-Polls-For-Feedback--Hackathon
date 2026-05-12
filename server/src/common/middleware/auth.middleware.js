import admin from "../config/firebase.js";

const verifyFirebaseToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				message: "No token",
			});
		}

		const decoded = await admin.auth().verifyIdToken(token);

		req.user = decoded;

		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid token",
		});
	}
};

export default verifyFirebaseToken;
