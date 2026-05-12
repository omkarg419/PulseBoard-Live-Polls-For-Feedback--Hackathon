const errorMiddleware = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	const statusCode = error.statusCode || 500;
	const message = error.message || "Internal server error";

	const response = {
		success: false,
		message,
	};

	if (error.details) {
		response.errors = error.details;
	}

	if (process.env.NODE_ENV !== "production" && error.stack) {
		response.stack = error.stack;
	}

	return res.status(statusCode).json(response);
};

export default errorMiddleware;
