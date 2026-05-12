import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";

const buildUserPayload = (firebaseUser) => {
	const name =
		firebaseUser.name ||
		firebaseUser.displayName ||
		firebaseUser.email?.split("@")[0] ||
		"Anonymous User";

	return {
		firebaseUID: firebaseUser.uid,
		name,
		email: firebaseUser.email?.toLowerCase(),
	};
};

export const upsertUserFromFirebase = async (firebaseUser) => {
	if (!firebaseUser?.uid || !firebaseUser?.email) {
		throw ApiError.badRequest("Firebase token is missing required user claims");
	}

	const payload = buildUserPayload(firebaseUser);
	return User.findOneAndUpdate(
		{ firebaseUID: payload.firebaseUID },
		{ $set: payload },
		{
			new: true,
			upsert: true,
			runValidators: true,
			setDefaultsOnInsert: true,
		},
	);
};

export const getCurrentUserProfile = async (firebaseUser) => {
	if (!firebaseUser?.uid) {
		throw ApiError.unauthorized("Authenticated user payload is missing");
	}

	const user = await User.findOne({ firebaseUID: firebaseUser.uid });
	if (user) {
		return user;
	}

	return upsertUserFromFirebase(firebaseUser);
};

export const getOrCreateUserByFirebaseUID = async (firebaseUser) => {
	return getCurrentUserProfile(firebaseUser);
};
