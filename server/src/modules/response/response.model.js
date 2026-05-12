import mongoose from "mongoose";

const responseAnswerSchema = new mongoose.Schema(
	{
		questionId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		selectedOption: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		versionKey: false,
	},
);

const responseSchema = new mongoose.Schema(
	{
		poll: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Poll",
			required: true,
			index: true,
		},
		respondent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		isAnonymous: {
			type: Boolean,
			default: false,
		},
		answers: {
			type: [responseAnswerSchema],
			required: true,
			validate: {
				validator(answers) {
					return Array.isArray(answers) && answers.length > 0;
				},
				message: "At least one answer is required",
			},
		},
		submittedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	},
);

responseSchema.index({ poll: 1, respondent: 1 }, { unique: true });

const Response = mongoose.model("Response", responseSchema);

export default Response;
