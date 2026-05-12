import mongoose from "mongoose";

import ApiError from "../../common/utils/api-error.js";
import { emitToPollRoom } from "../../common/config/socket.js";
import { getOrCreateUserByFirebaseUID } from "../auth/auth.service.js";
import Poll from "../poll/poll.model.js";
import Response from "./response.model.js";
import { refreshPollStatus } from "../poll/poll.service.js";
import { getPollAnalytics } from "../analytics/analytics.service.js";

const assertValidPollId = (pollId) => {
	if (!mongoose.Types.ObjectId.isValid(pollId)) {
		throw ApiError.badRequest("Invalid poll ID");
	}
};

const normalizeBoolean = (value, fallback = false) => {
	if (typeof value === "boolean") {
		return value;
	}

	if (value === "true") {
		return true;
	}

	if (value === "false") {
		return false;
	}

	return fallback;
};

const validateAnswers = (poll, answers) => {
	if (!Array.isArray(answers) || answers.length === 0) {
		throw ApiError.unprocessableEntity("At least one answer is required");
	}

	const errors = [];
	const normalizedAnswers = [];
	const answerMap = new Map();

	for (const answer of answers) {
		const questionId = answer?.questionId?.toString();
		const selectedOption = answer?.selectedOption?.toString();

		if (!questionId || !selectedOption) {
			errors.push("Each answer must contain questionId and selectedOption");
			continue;
		}

		if (answerMap.has(questionId)) {
			errors.push(`Duplicate answer received for question ${questionId}`);
			continue;
		}

		answerMap.set(questionId, selectedOption);
	}

	for (const question of poll.questions) {
		const questionId = question._id.toString();
		const selectedOption = answerMap.get(questionId);
		const optionIds = question.options.map((option) => option._id.toString());

		if (!selectedOption) {
			if (question.required) {
				errors.push(
					`Required question "${question.question}" was not answered`,
				);
			}
			continue;
		}

		if (!optionIds.includes(selectedOption)) {
			errors.push(
				`Selected option is invalid for question "${question.question}"`,
			);
			continue;
		}

		normalizedAnswers.push({
			questionId,
			selectedOption,
		});
	}

	if (errors.length > 0) {
		throw ApiError.unprocessableEntity("Response validation failed", errors);
	}

	return normalizedAnswers;
};

const incrementPollVotes = (poll, normalizedAnswers) => {
	for (const answer of normalizedAnswers) {
		const question = poll.questions.id(answer.questionId);
		if (!question) {
			throw ApiError.badRequest("Question no longer exists on this poll");
		}

		const option = question.options.id(answer.selectedOption);
		if (!option) {
			throw ApiError.badRequest(
				"Selected option no longer exists on this poll",
			);
		}

		option.votes += 1;
	}

	poll.totalResponses += 1;
};

export const submitResponse = async (firebaseUser, pollId, payload) => {
	assertValidPollId(pollId);
	const respondent = await getOrCreateUserByFirebaseUID(firebaseUser);
	const isAnonymous = normalizeBoolean(payload?.isAnonymous, false);
	const session = await mongoose.startSession();

	let responseDocument = null;
	let pollSnapshot = null;

	try {
		await session.withTransaction(async () => {
			const poll = await Poll.findById(pollId).session(session);
			if (!poll) {
				throw ApiError.notFound("Poll not found");
			}

			await refreshPollStatus(poll, session);
			if (poll.status === "expired") {
				throw ApiError.badRequest("Poll has expired");
			}

			if (!poll.allowAnonymous && isAnonymous) {
				throw ApiError.badRequest(
					"Anonymous responses are disabled for this poll",
				);
			}

			const existingResponse = await Response.findOne({
				poll: poll._id,
				respondent: respondent._id,
			}).session(session);

			if (existingResponse) {
				throw ApiError.conflict(
					"You have already submitted a response for this poll",
				);
			}

			const normalizedAnswers = validateAnswers(poll, payload?.answers);
			incrementPollVotes(poll, normalizedAnswers);
			poll.status =
				poll.expiresAt && poll.expiresAt.getTime() <= Date.now()
					? "expired"
					: "active";
			await poll.save({ session });

			const [createdResponse] = await Response.create(
				[
					{
						poll: poll._id,
						respondent: respondent._id,
						isAnonymous,
						answers: normalizedAnswers,
						submittedAt: new Date(),
					},
				],
				{ session },
			);

			responseDocument = createdResponse;
			pollSnapshot = poll.toObject();
		});
	} catch (error) {
		if (error?.code === 11000) {
			throw ApiError.conflict(
				"You have already submitted a response for this poll",
			);
		}

		throw error;
	} finally {
		session.endSession();
	}

	const analytics = await getPollAnalytics(firebaseUser, pollId, {
		skipOwnershipCheck: true,
		pollOverride: pollSnapshot,
	});
	emitToPollRoom(pollId, "response-update", {
		pollId,
		responseId: responseDocument._id,
		analytics,
	});
	emitToPollRoom(pollId, "analytics-update", analytics);

	return responseDocument.populate(
		"respondent",
		"firebaseUID name email createdAt",
	);
};

export const getResponsesForPoll = async (firebaseUser, pollId) => {
	assertValidPollId(pollId);
	const poll = await Poll.findById(pollId);
	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	const creator = await getOrCreateUserByFirebaseUID(firebaseUser);
	if (poll.creator.toString() !== creator._id.toString()) {
		throw ApiError.forbidden(
			"You do not have permission to access these responses",
		);
	}

	return Response.find({ poll: poll._id })
		.populate("respondent", "firebaseUID name email createdAt")
		.sort({ submittedAt: -1 });
};
