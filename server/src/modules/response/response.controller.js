import asyncHandler from "../../common/utils/async-handler.js";
import ApiResponse from "../../common/utils/api-response.js";
import { getResponsesForPoll, submitResponse } from "./response.service.js";

export const submitResponseController = asyncHandler(async (req, res) => {
	const response = await submitResponse(req.user, req.params.pollId, req.body);
	return ApiResponse.created(res, "Response submitted successfully", response);
});

export const getResponsesForPollController = asyncHandler(async (req, res) => {
	const responses = await getResponsesForPoll(req.user, req.params.pollId);
	return ApiResponse.ok(res, "Responses fetched successfully", responses);
});
