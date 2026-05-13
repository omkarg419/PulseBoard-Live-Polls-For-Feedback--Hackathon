import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import PollForm from "../components/poll/PollForm";
import { createPoll } from "../services/poll.service";

const createId = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createOption = (text = "") => ({
	id: createId(),
	text,
});

const createQuestion = () => ({
	id: createId(),
	question: "",
	required: true,
	options: [createOption(), createOption()],
});

const createInitialForm = () => ({
	title: "",
	description: "",
	allowAnonymous: true,
	expiresAt: "",
	questions: [createQuestion()],
});

const CreatePoll = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState(createInitialForm);
	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const updateField = (field, value) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const addQuestion = () => {
		setForm((current) => ({
			...current,
			questions: [...current.questions, createQuestion()],
		}));
	};

	const removeQuestion = (questionId) => {
		setForm((current) => ({
			...current,
			questions:
				current.questions.length > 1
					? current.questions.filter((question) => question.id !== questionId)
					: current.questions,
		}));
	};

	const updateQuestion = (questionId, value) => {
		setForm((current) => ({
			...current,
			questions: current.questions.map((question) =>
				question.id === questionId
					? { ...question, question: value }
					: question,
			),
		}));
	};

	const toggleQuestionRequired = (questionId) => {
		setForm((current) => ({
			...current,
			questions: current.questions.map((question) =>
				question.id === questionId
					? { ...question, required: !question.required }
					: question,
			),
		}));
	};

	const addOption = (questionId) => {
		setForm((current) => ({
			...current,
			questions: current.questions.map((question) =>
				question.id === questionId
					? { ...question, options: [...question.options, createOption()] }
					: question,
			),
		}));
	};

	const removeOption = (questionId, optionId) => {
		setForm((current) => ({
			...current,
			questions: current.questions.map((question) =>
				question.id === questionId && question.options.length > 2
					? {
							...question,
							options: question.options.filter(
								(option) => option.id !== optionId,
							),
						}
					: question,
			),
		}));
	};

	const updateOption = (questionId, optionId, value) => {
		setForm((current) => ({
			...current,
			questions: current.questions.map((question) =>
				question.id === questionId
					? {
							...question,
							options: question.options.map((option) =>
								option.id === optionId ? { ...option, text: value } : option,
							),
						}
					: question,
			),
		}));
	};

	const validate = () => {
		const nextErrors = {};
		const questionErrors = [];

		if (!form.title.trim()) {
			nextErrors.title = "Poll title is required.";
		}

		if (!form.expiresAt) {
			nextErrors.expiresAt = "Expiry date is required.";
		} else if (new Date(form.expiresAt).getTime() <= Date.now()) {
			nextErrors.expiresAt = "Expiry date must be in the future.";
		}

		form.questions.forEach((question) => {
			let questionError = "";

			if (!question.question.trim()) {
				questionError = "Question text is required.";
			} else if (question.options.length < 2) {
				questionError = "Each question needs at least two options.";
			} else if (question.options.some((option) => !option.text.trim())) {
				questionError = "Every option needs text.";
			}

			questionErrors.push(questionError);
		});

		if (questionErrors.some(Boolean)) {
			nextErrors.questions = questionErrors;
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validate()) {
			toast.error("Please fix the highlighted fields");
			return;
		}

		const payload = {
			title: form.title.trim(),
			description: form.description.trim(),
			allowAnonymous: form.allowAnonymous,
			expiresAt: new Date(form.expiresAt).toISOString(),
			questions: form.questions.map((question) => ({
				question: question.question.trim(),
				required: question.required,
				options: question.options.map((option) => ({
					text: option.text.trim(),
				})),
			})),
		};

		try {
			setSubmitting(true);
			const created = await createPoll(payload);
			toast.success("Poll created successfully");
			navigate("/dashboard");
			return created;
		} catch (createError) {
			toast.error(
				createError?.response?.data?.message || "Unable to create poll",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="space-y-8">
			<section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
					Create poll
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					Build a single-choice poll with questions and options.
				</h1>
				<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
					Add or remove questions, set a future expiry date, and control
					anonymous responses from one clean form.
				</p>
			</section>

			<PollForm
				form={form}
				errors={errors}
				onFieldChange={updateField}
				onToggleAnonymous={() =>
					updateField("allowAnonymous", !form.allowAnonymous)
				}
				onAddQuestion={addQuestion}
				onRemoveQuestion={removeQuestion}
				onQuestionChange={updateQuestion}
				onToggleQuestionRequired={toggleQuestionRequired}
				onAddOption={addOption}
				onRemoveOption={removeOption}
				onOptionChange={updateOption}
				onSubmit={handleSubmit}
				submitting={submitting}
			/>
		</div>
	);
};

export default CreatePoll;
