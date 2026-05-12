import mongoose from "mongoose";

import ApiError from "../../common/utils/api-error.js";
import { getOrCreateUserByFirebaseUID } from "../auth/auth.service.js";
import Poll from "../poll/poll.model.js";
import Response from "../response/response.model.js";

const assertValidPollId = (pollId) => {
	if (!mongoose.Types.ObjectId.isValid(pollId)) {
		throw ApiError.badRequest("Invalid poll ID");
	}
};

const buildQuestionSummaries = (poll) => {
	return poll.questions.map((question) => {
		const totalVotes = question.options.reduce(
			(sum, option) => sum + option.votes,
			0,
		);

		return {
			questionId: question._id,
			question: question.question,
			required: question.required,
			totalVotes,
			options: question.options.map((option) => ({
				optionId: option._id,
				text: option.text,
				votes: option.votes,
				percentage:
					totalVotes > 0
						? Number(((option.votes / totalVotes) * 100).toFixed(2))
						: 0,
			})),
		};
	});
};

const buildParticipationInsights = (poll, responses) => {
	const anonymousResponses = responses.filter(
		(response) => response.isAnonymous,
	).length;
	const identifiedResponses = responses.length - anonymousResponses;
	const totalAnswers = responses.reduce(
		(sum, response) => sum + response.answers.length,
		0,
	);
	const averageAnswersPerResponse =
		responses.length > 0
			? Number((totalAnswers / responses.length).toFixed(2))
			: 0;
	const expectedAnswers = poll.questions.length * responses.length;
	const completionRate =
		expectedAnswers > 0
			? Number(((totalAnswers / expectedAnswers) * 100).toFixed(2))
			: 0;

	return {
		totalResponses: responses.length,
		anonymousResponses,
		identifiedResponses,
		anonymousRate:
			responses.length > 0
				? Number(((anonymousResponses / responses.length) * 100).toFixed(2))
				: 0,
		averageAnswersPerResponse,
		completionRate,
		pollStatus: poll.status,
		isPublished: poll.isPublished,
		expiresAt: poll.expiresAt,
	};
};

export const getPollAnalytics = async (firebaseUser, pollId, options = {}) => {
	assertValidPollId(pollId);
	const creator = options.skipOwnershipCheck
		? null
		: await getOrCreateUserByFirebaseUID(firebaseUser);

	const poll =
		options.pollOverride ||
		(await Poll.findById(pollId).populate(
			"creator",
			"firebaseUID name email createdAt",
		));
	if (!poll) {
		throw ApiError.notFound("Poll not found");
	}

	if (
		!options.skipOwnershipCheck &&
		poll.creator._id.toString() !== creator._id.toString()
	) {
		throw ApiError.forbidden(
			"You do not have permission to access this poll analytics",
		);
	}

	const responses = await Response.find({ poll: poll._id })
		.sort({ submittedAt: -1 })
		.populate("respondent", "firebaseUID name email createdAt");

	return {
		poll: {
			id: poll._id,
			title: poll.title,
			description: poll.description,
			allowAnonymous: poll.allowAnonymous,
			expiresAt: poll.expiresAt,
			isPublished: poll.isPublished,
			status: poll.status,
			totalResponses: poll.totalResponses,
		},
		questionSummaries: buildQuestionSummaries(poll),
		participationInsights: buildParticipationInsights(poll, responses),
		responses: responses.map((response) => ({
			id: response._id,
			respondent: response.isAnonymous ? null : response.respondent,
			isAnonymous: response.isAnonymous,
			answers: response.answers,
			submittedAt: response.submittedAt,
		})),
	};
};
