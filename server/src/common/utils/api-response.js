class ApiResponse {
	static success(res, statusCode, message, data = null, meta = null) {
		const payload = {
			success: true,
			message,
		};

		if (data !== null) {
			payload.data = data;
		}

		if (meta !== null) {
			payload.meta = meta;
		}

		return res.status(statusCode).json(payload);
	}

	static ok(res, message, data = null, meta = null) {
		return ApiResponse.success(res, 200, message, data, meta);
	}

	static created(res, message, data = null, meta = null) {
		return ApiResponse.success(res, 201, message, data, meta);
	}

	static noContent(res) {
		return res.status(204).send();
	}
}

export default ApiResponse;
