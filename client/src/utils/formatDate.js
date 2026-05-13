export const formatDate = (value) => {
	if (!value) {
		return "N/A";
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "N/A";
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
};
