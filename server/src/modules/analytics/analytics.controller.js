import asyncHandler from "../../common/utils/async-handler.js";
import ApiResponse from "../../common/utils/api-response.js";
import { getPollAnalytics } from "./analytics.service.js";

export const getAnalyticsController = asyncHandler(async (req, res) => {
	const analytics = await getPollAnalytics(req.user, req.params.pollId);
	return ApiResponse.ok(res, "Analytics fetched successfully", analytics);
});
