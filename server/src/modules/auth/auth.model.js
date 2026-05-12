import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		firebaseUID: {
			type: String,
			required: true,
			unique: true,
			index: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			lowercase: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			immutable: true,
		},
	},
	{
		versionKey: false,
	},
);

const User = mongoose.model("User", userSchema);

export default User;
