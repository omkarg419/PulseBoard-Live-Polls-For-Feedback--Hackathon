import QuestionCard from "./QuestionCard";

const PollForm = ({
	form,
	errors,
	onFieldChange,
	onToggleAnonymous,
	onAddQuestion,
	onRemoveQuestion,
	onQuestionChange,
	onToggleQuestionRequired,
	onAddOption,
	onRemoveOption,
	onOptionChange,
	onSubmit,
	submitting,
}) => {
	return (
		<form
			onSubmit={onSubmit}
			className="grid gap-6"
		>
			<section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
				<div className="grid gap-4">
					<div>
						<label className="mb-2 block text-sm font-medium text-slate-200">
							Poll title
						</label>
						<input
							type="text"
							value={form.title}
							onChange={(event) => onFieldChange("title", event.target.value)}
							placeholder="Weekly product feedback"
							className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
						/>
						{errors.title ? (
							<p className="mt-2 text-sm text-rose-300">{errors.title}</p>
						) : null}
					</div>

					<div>
						<label className="mb-2 block text-sm font-medium text-slate-200">
							Description
						</label>
						<textarea
							rows="4"
							value={form.description}
							onChange={(event) =>
								onFieldChange("description", event.target.value)
							}
							placeholder="Give respondents a short explanation of the poll."
							className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-200">
								Expiry date and time
							</label>
							<input
								type="datetime-local"
								value={form.expiresAt}
								onChange={(event) =>
									onFieldChange("expiresAt", event.target.value)
								}
								className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
							/>
							{errors.expiresAt ? (
								<p className="mt-2 text-sm text-rose-300">{errors.expiresAt}</p>
							) : null}
						</div>

						<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
							<div>
								<p className="text-sm font-medium text-white">
									Anonymous responses
								</p>
								<p className="text-xs text-slate-400">
									Allow respondents to stay anonymous.
								</p>
							</div>
							<button
								type="button"
								onClick={onToggleAnonymous}
								className={[
									"relative inline-flex h-8 w-14 items-center rounded-full transition",
									form.allowAnonymous ? "bg-cyan-400" : "bg-slate-700",
								].join(" ")}
							>
								<span
									className={[
										"inline-block h-6 w-6 rounded-full bg-white transition",
										form.allowAnonymous ? "translate-x-7" : "translate-x-1",
									].join(" ")}
								/>
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold text-white">Questions</h2>
						<p className="text-sm text-slate-400">
							Build each question as a single-choice poll.
						</p>
					</div>
					<button
						type="button"
						onClick={onAddQuestion}
						className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
					>
						Add question
					</button>
				</div>

				<div className="grid gap-4">
					{form.questions.map((question, index) => (
						<QuestionCard
							key={question.id}
							question={question}
							index={index}
							error={errors.questions?.[index]}
							canRemoveQuestion={form.questions.length > 1}
							onQuestionChange={(value) => onQuestionChange(question.id, value)}
							onToggleRequired={() => onToggleQuestionRequired(question.id)}
							onAddOption={() => onAddOption(question.id)}
							onRemoveQuestion={() => onRemoveQuestion(question.id)}
							onOptionChange={(optionId, value) =>
								onOptionChange(question.id, optionId, value)
							}
							onRemoveOption={(optionId) =>
								onRemoveOption(question.id, optionId)
							}
						/>
					))}
				</div>
			</section>

			<div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
				<p className="text-sm text-slate-300">
					Single option questions, future expiry, and secure Firebase-backed
					access.
				</p>
				<button
					type="submit"
					disabled={submitting}
					className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{submitting ? "Saving..." : "Create poll"}
				</button>
			</div>
		</form>
	);
};

export default PollForm;
