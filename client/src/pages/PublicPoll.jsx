import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import { formatDate } from "../utils/formatDate";
import { getPublicPollById } from "../services/poll.service";
import { submitResponse } from "../services/response.service";

const PublicPoll = () => {
	const { pollId } = useParams();
	const { currentUser, loading: authLoading } = useAuth();
	const [poll, setPoll] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [answers, setAnswers] = useState({});
	const [anonymous, setAnonymous] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	const loadPoll = useCallback(
		async (showLoader = true) => {
			try {
				if (showLoader) {
					setLoading(true);
				}
				setError("");
				const data = await getPublicPollById(pollId);
				setPoll(data);
			} catch (loadError) {
				setError(
					loadError?.response?.data?.message || "Unable to load this poll",
				);
			} finally {
				if (showLoader) {
					setLoading(false);
				}
			}
		},
		[pollId],
	);

	useEffect(() => {
		const fetchPoll = async () => {
			await loadPoll();
		};
		fetchPoll();
	}, [loadPoll]);

	useSocket({
		pollId,
		enabled: true,
		onAnalyticsUpdate: () => {
			loadPoll(false);
		},
		onPollPublished: () => {
			loadPoll(false);
		},
	});

	const handleChange = (questionId, optionId) => {
		setAnswers((current) => ({ ...current, [questionId]: optionId }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!poll) {
			return;
		}

		const missingRequired = poll.questions.some(
			(question) => question.required && !answers[question._id],
		);

		if (missingRequired) {
			toast.error("Answer all required questions");
			return;
		}

		const payload = {
			answers: poll.questions
				.filter((question) => answers[question._id])
				.map((question) => ({
					questionId: question._id,
					selectedOption: answers[question._id],
				})),
			isAnonymous: poll.allowAnonymous ? anonymous : false,
		};

		try {
			setSubmitting(true);
			await submitResponse(pollId, payload);
			toast.success("Response submitted");
			setSubmitted(true);
			setAnswers({});
			setAnonymous(false);
			await loadPoll();
		} catch (submitError) {
			toast.error(
				submitError?.response?.data?.message || "Unable to submit response",
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (authLoading || loading) {
		return (
			<Loader
				fullScreen
				label="Loading poll..."
			/>
		);
	}

	if (error) {
		return (
			<EmptyState
				title="Poll unavailable"
				description={error}
				actionLabel="Go back home"
				actionTo="/"
			/>
		);
	}

	if (!poll) {
		return (
			<Loader
				fullScreen
				label="Preparing poll..."
			/>
		);
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<section className="rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
							Public poll
						</p>
						<h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
							{poll.title}
						</h1>
						{poll.description ? (
							<p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
								{poll.description}
							</p>
						) : null}
					</div>
					<div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
						<p>Expires {formatDate(poll.expiresAt)}</p>
						<p className="mt-1">
							{poll.questions.length} question
							{poll.questions.length === 1 ? "" : "s"}
						</p>
						<p className="mt-2 text-slate-400">
							{poll.totalResponses || 0} responses collected
						</p>
					</div>
				</div>
			</section>

			{!poll.isPublished && !currentUser ? (
				<EmptyState
					title="Sign in to submit"
					description="You can view the poll from this link, but submitting a response still requires a logged-in session."
					actionLabel="Go to login"
					actionTo="/login"
				/>
			) : null}

			{submitted ? (
				<div className="space-y-4">
					<EmptyState
						title="Response received"
						description="Thanks — your response was submitted successfully."
						actionLabel="View results"
						onAction={() => setSubmitted(false)}
					/>
					<div className="mt-4 text-center">
						<Link
							to="/"
							className="mt-2 inline-flex rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
						>
							Go home
						</Link>
					</div>
				</div>
			) : poll.isPublished ? (
				<div className="space-y-4">
					<section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 shadow-xl shadow-slate-950/20">
						<p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Final Results
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-white">
							This poll is published and read-only
						</h2>
						<p className="mt-2 text-sm text-slate-300">
							Voting is closed. Visitors can only see the final vote breakdown.
						</p>
					</section>

					{poll.questions.map((question) => {
						const totalVotes = question.options.reduce(
							(sum, option) => sum + (option.votes || 0),
							0,
						);

						return (
							<section
								key={question._id}
								className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
											Question
										</p>
										<h2 className="mt-1 text-xl font-semibold text-white">
											{question.question}
										</h2>
									</div>
									<div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-slate-300">
										<p>Total votes</p>
										<p className="mt-1 text-lg font-semibold text-white">
											{totalVotes}
										</p>
									</div>
								</div>

								<div className="mt-4 space-y-3">
									{question.options.map((option) => {
										const percentage =
											totalVotes > 0
												? ((option.votes || 0) / totalVotes) * 100
												: 0;

										return (
											<div
												key={option._id}
												className="rounded-2xl border border-white/10 bg-white/5 p-4"
											>
												<div className="flex items-center justify-between gap-4">
													<span className="text-white">{option.text}</span>

													<span className="text-cyan-300">
														{option.votes || 0} votes
													</span>
												</div>

												<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
													<div
														className="h-full bg-cyan-400"
														style={{
															width: `${percentage}%`,
														}}
													/>
												</div>

												<p className="mt-1 text-xs text-slate-400">
													{percentage.toFixed(1)}%
												</p>
											</div>
										);
									})}
								</div>
							</section>
						);
					})}
				</div>
			) : poll.status === "expired" ? (
				<EmptyState
					title="Poll expired"
					description="This poll is no longer accepting responses."
				/>
			) : !currentUser ? (
				<EmptyState
					title="Sign in to participate"
					description="Please log in to fill out and submit this poll."
					actionLabel="Go to login"
					actionTo="/login"
				/>
			) : submitted ? (
				<EmptyState
					title="Response received"
					description="Your response was submitted successfully. You can revisit the dashboard or share the poll link again."
					actionLabel="Open dashboard"
					actionTo="/dashboard"
				/>
			) : (
				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					{poll.questions.map((question) => (
						<section
							key={question._id}
							className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20"
						>
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
										Question
									</p>
									<h2 className="mt-1 text-xl font-semibold text-white">
										{question.question}
									</h2>
								</div>
								{question.required ? (
									<span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
										Required
									</span>
								) : null}
							</div>

							<div className="mt-4 grid gap-3">
								{question.options.map((option) => {
									return (
										<label
											key={option._id}
											className="flex cursor-pointer items-center gap-3 justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													name={question._id}
													checked={answers[question._id] === option._id}
													onChange={() =>
														handleChange(question._id, option._id)
													}
													className="h-4 w-4 border-slate-500 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
												/>
												<span>{option.text}</span>
											</div>
										</label>
									);
								})}
							</div>
						</section>
					))}

					{poll.allowAnonymous ? (
						<div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
							<label className="flex cursor-pointer items-center gap-3 text-sm text-slate-200">
								<input
									type="checkbox"
									checked={anonymous}
									onChange={(event) => setAnonymous(event.target.checked)}
									className="h-4 w-4 rounded border-slate-500 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
								/>
								<span>Submit anonymously</span>
							</label>
						</div>
					) : null}

					<div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
						<p className="text-sm text-slate-300">
							Single choice answers only.
						</p>
						<button
							type="submit"
							disabled={submitting || poll.status === "expired"}
							className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{poll.status === "expired"
								? "Poll expired"
								: submitting
									? "Submitting..."
									: "Submit response"}
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default PublicPoll;
