import mongoose from "mongoose";

const connectDB = async () => {
	try {
		mongoose.set("strictQuery", true);
		await mongoose.connect(process.env.MONGO_URI, {
			dbName: process.env.MONGO_DB_NAME || undefined,
			serverSelectionTimeoutMS: 10000,
		});
		console.log("MongoDB connected");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

export default connectDB;
