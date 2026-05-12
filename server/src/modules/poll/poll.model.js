import mongoose from "mongoose";

import { POLL_STATUS } from "../../common/constants/index.js";

const pollOptionSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true,
		},
		votes: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		versionKey: false,
	},
);

const pollQuestionSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true,
		},
		required: {
			type: Boolean,
			default: true,
		},
		options: {
			type: [pollOptionSchema],
			required: true,
			validate: {
				validator(options) {
					return Array.isArray(options) && options.length >= 2;
				},
				message: "Each question must have at least two options",
			},
		},
	},
	{
		versionKey: false,
	},
);

const pollSchema = new mongoose.Schema(
	{
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: "",
			trim: true,
		},
		allowAnonymous: {
			type: Boolean,
			default: false,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
			enum: [POLL_STATUS.ACTIVE, POLL_STATUS.EXPIRED],
			default: POLL_STATUS.ACTIVE,
			index: true,
		},
		totalResponses: {
			type: Number,
			default: 0,
			min: 0,
		},
		questions: {
			type: [pollQuestionSchema],
			required: true,
			validate: {
				validator(questions) {
					return Array.isArray(questions) && questions.length > 0;
				},
				message: "A poll must contain at least one question",
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

pollSchema.index({ creator: 1, createdAt: -1 });

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
