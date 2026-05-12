import mongoose from "mongoose";

import ApiError from "../../common/utils/api-error.js";
import { POLL_STATUS } from "../../common/constants/index.js";
import Poll from "./poll.model.js";
import { getOrCreateUserByFirebaseUID } from "../auth/auth.service.js";
import {
	validateCreatePollPayload,
	validateUpdatePollPayload,
} from "./poll.validation.js";

const assertValidPollId = (pollId) => {
	if (!mongoose.Types.ObjectId.isValid(pollId)) {
		throw ApiError.badRequest("Invalid poll ID");
	}
};

const getCreator = async (firebaseUser) => {
	return getOrCreateUserByFirebaseUID(firebaseUser);
};

const assertOwnership = (poll, creatorId) => {
	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	if (poll.creator.toString() !== creatorId.toString()) {
		throw ApiError.forbidden("You do not have permission to access this poll");
	}

	return poll;
};

const markExpiredIfNeeded = async (poll, session = null) => {
	if (
		poll.expiresAt &&
		poll.expiresAt.getTime() <= Date.now() &&
		poll.status !== POLL_STATUS.EXPIRED
	) {
		poll.status = POLL_STATUS.EXPIRED;
		await poll.save(session ? { session } : undefined);
	}

	return poll;
};

export const createPoll = async (firebaseUser, payload) => {
	const creator = await getCreator(firebaseUser);
	const pollData = validateCreatePollPayload(payload);

	const poll = await Poll.create({
		creator: creator._id,
		...pollData,
		status: POLL_STATUS.ACTIVE,
		totalResponses: 0,
	});

	return poll.populate("creator", "firebaseUID name email createdAt");
};

export const getMyPolls = async (firebaseUser) => {
	const creator = await getCreator(firebaseUser);
	return Poll.find({ creator: creator._id }).sort({ createdAt: -1 });
};

export const getPollById = async (firebaseUser, pollId) => {
	assertValidPollId(pollId);
	const creator = await getCreator(firebaseUser);
	const poll = await Poll.findOne({
		_id: pollId,
		creator: creator._id,
	}).populate("creator", "firebaseUID name email createdAt");
	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	await markExpiredIfNeeded(poll);
	return poll;
};

export const updatePoll = async (firebaseUser, pollId, payload) => {
	assertValidPollId(pollId);
	const creator = await getCreator(firebaseUser);
	const poll = await Poll.findOne({ _id: pollId, creator: creator._id });

	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	if (poll.isPublished) {
		throw ApiError.forbidden("Published polls cannot be modified");
	}

	const updates = validateUpdatePollPayload(payload);
	Object.assign(poll, updates);

	if (poll.expiresAt && poll.expiresAt.getTime() <= Date.now()) {
		throw ApiError.badRequest("Poll expiry must be set in the future");
	}

	poll.status = POLL_STATUS.ACTIVE;
	await poll.save();

	return poll.populate("creator", "firebaseUID name email createdAt");
};

export const deletePoll = async (firebaseUser, pollId) => {
	assertValidPollId(pollId);
	const creator = await getCreator(firebaseUser);
	const poll = await Poll.findOneAndDelete({
		_id: pollId,
		creator: creator._id,
		isPublished: false,
	});

	if (!poll) {
		throw ApiError.notFound("Poll not found or cannot be deleted");
	}

	return poll;
};

export const publishPoll = async (firebaseUser, pollId) => {
	assertValidPollId(pollId);
	const creator = await getCreator(firebaseUser);
	const poll = await Poll.findOne({ _id: pollId, creator: creator._id });

	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	await markExpiredIfNeeded(poll);
	if (poll.status !== POLL_STATUS.EXPIRED) {
		throw ApiError.badRequest("Only expired polls can be published publicly");
	}

	poll.isPublished = true;
	await poll.save();

	return poll.populate("creator", "firebaseUID name email createdAt");
};

export const getPollForSubmission = async (pollId) => {
	assertValidPollId(pollId);
	const poll = await Poll.findById(pollId);
	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	await markExpiredIfNeeded(poll);
	if (poll.status === POLL_STATUS.EXPIRED) {
		throw ApiError.badRequest("Poll has expired");
	}

	return poll;
};

export const getPollOwnedByCreator = async (firebaseUser, pollId) => {
	assertValidPollId(pollId);
	const creator = await getCreator(firebaseUser);
	const poll = await Poll.findById(pollId);
	return assertOwnership(poll, creator._id);
};

export const refreshPollStatus = markExpiredIfNeeded;
