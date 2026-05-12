import asyncHandler from "../../common/utils/async-handler.js";
import ApiResponse from "../../common/utils/api-response.js";
import {
	getCurrentUserProfile,
	upsertUserFromFirebase,
} from "./auth.service.js";

export const syncUser = asyncHandler(async (req, res) => {
	const user = await upsertUserFromFirebase(req.user);
	return ApiResponse.created(res, "User synced successfully", user);
});

export const me = asyncHandler(async (req, res) => {
	const user = await getCurrentUserProfile(req.user);
	return ApiResponse.ok(
		res,
		"Authenticated user profile fetched successfully",
		user,
	);
});
