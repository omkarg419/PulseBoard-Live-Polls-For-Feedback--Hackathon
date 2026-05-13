import asyncHandler from "../../common/utils/async-handler.js";
import ApiResponse from "../../common/utils/api-response.js";
import {
	createPoll,
	deletePoll,
	getMyPolls,
	getPollById,
	getPollForSubmission,
	publishPoll,
	updatePoll,
} from "./poll.service.js";

export const createPollController = asyncHandler(async (req, res) => {
	const poll = await createPoll(req.user, req.body);
	return ApiResponse.created(res, "Poll created successfully", poll);
});

export const getMyPollsController = asyncHandler(async (req, res) => {
	const polls = await getMyPolls(req.user);
	return ApiResponse.ok(res, "Polls fetched successfully", polls);
});

export const getPollByIdController = asyncHandler(async (req, res) => {
	const poll = await getPollById(req.user, req.params.pollId);
	return ApiResponse.ok(res, "Poll fetched successfully", poll);
});

export const getPublicPollByIdController = asyncHandler(async (req, res) => {
	const poll = await getPollForSubmission(req.params.pollId);
	return ApiResponse.ok(res, "Poll fetched successfully", poll);
});

export const updatePollController = asyncHandler(async (req, res) => {
	const poll = await updatePoll(req.user, req.params.pollId, req.body);
	return ApiResponse.ok(res, "Poll updated successfully", poll);
});

export const deletePollController = asyncHandler(async (req, res) => {
	await deletePoll(req.user, req.params.pollId);
	return ApiResponse.ok(res, "Poll deleted successfully");
});

export const publishPollController = asyncHandler(async (req, res) => {
	const poll = await publishPoll(req.user, req.params.pollId);
	return ApiResponse.ok(res, "Poll published successfully", poll);
});
