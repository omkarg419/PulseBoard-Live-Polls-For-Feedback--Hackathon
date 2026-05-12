import ApiError from "../../common/utils/api-error.js";

const parseBoolean = (value, fallback = false) => {
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

const normalizeOptions = (options, questionIndex, errors) => {
	if (!Array.isArray(options) || options.length < 2) {
		errors.push(
			`Question ${questionIndex + 1} must include at least two options`,
		);
		return [];
	}

	return options.map((option, optionIndex) => {
		if (!option || typeof option.text !== "string" || !option.text.trim()) {
			errors.push(
				`Question ${questionIndex + 1}, option ${optionIndex + 1} must include text`,
			);
		}

		return {
			text: String(option?.text || "").trim(),
			votes: Number.isFinite(option?.votes) ? Number(option.votes) : 0,
		};
	});
};

const normalizeQuestions = (questions, errors) => {
	if (!Array.isArray(questions) || questions.length === 0) {
		errors.push("Poll must include at least one question");
		return [];
	}

	return questions.map((questionItem, questionIndex) => {
		if (
			!questionItem ||
			typeof questionItem.question !== "string" ||
			!questionItem.question.trim()
		) {
			errors.push(`Question ${questionIndex + 1} must include text`);
		}

		const options = normalizeOptions(
			questionItem?.options,
			questionIndex,
			errors,
		);

		return {
			question: String(questionItem?.question || "").trim(),
			required: parseBoolean(questionItem?.required, true),
			options,
		};
	});
};

export const validateCreatePollPayload = (payload) => {
	const errors = [];

	const title = String(payload?.title || "").trim();
	if (!title) {
		errors.push("Poll title is required");
	}

	const description = String(payload?.description || "").trim();
	const allowAnonymous = parseBoolean(payload?.allowAnonymous, false);
	const expiresAt = payload?.expiresAt ? new Date(payload.expiresAt) : null;

	if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
		errors.push("A valid expiresAt date is required");
	} else if (expiresAt.getTime() <= Date.now()) {
		errors.push("Poll expiry must be set in the future");
	}

	const questions = normalizeQuestions(payload?.questions, errors);

	if (errors.length > 0) {
		throw ApiError.unprocessableEntity("Poll validation failed", errors);
	}

	return {
		title,
		description,
		allowAnonymous,
		expiresAt,
		questions,
	};
};

export const validateUpdatePollPayload = (payload) => {
	const errors = [];
	const updates = {};

	if (payload?.title !== undefined) {
		const title = String(payload.title || "").trim();
		if (!title) {
			errors.push("Poll title cannot be empty");
		} else {
			updates.title = title;
		}
	}

	if (payload?.description !== undefined) {
		updates.description = String(payload.description || "").trim();
	}

	if (payload?.allowAnonymous !== undefined) {
		updates.allowAnonymous = parseBoolean(payload.allowAnonymous, false);
	}

	if (payload?.expiresAt !== undefined) {
		const expiresAt = new Date(payload.expiresAt);
		if (Number.isNaN(expiresAt.getTime())) {
			errors.push("A valid expiresAt date is required");
		} else if (expiresAt.getTime() <= Date.now()) {
			errors.push("Poll expiry must be set in the future");
		} else {
			updates.expiresAt = expiresAt;
		}
	}

	if (payload?.questions !== undefined) {
		updates.questions = normalizeQuestions(payload.questions, errors);
	}

	if (errors.length > 0) {
		throw ApiError.unprocessableEntity("Poll validation failed", errors);
	}

	return updates;
};
