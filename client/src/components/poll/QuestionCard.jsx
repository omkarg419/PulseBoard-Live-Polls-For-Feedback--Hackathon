import OptionInput from "./OptionInput";

const QuestionCard = ({
	question,
	index,
	error,
	canRemoveQuestion,
	onQuestionChange,
	onToggleRequired,
	onAddOption,
	onRemoveQuestion,
	onOptionChange,
	onRemoveOption,
}) => {
	return (
		<section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
						Question {index + 1}
					</p>
					<h3 className="mt-1 text-lg font-semibold text-white">
						Build a single-choice prompt
					</h3>
				</div>

				{canRemoveQuestion ? (
					<button
						type="button"
						onClick={onRemoveQuestion}
						className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-200"
					>
						Remove question
					</button>
				) : null}
			</div>

			<div className="mt-4 grid gap-4">
				<div>
					<label className="mb-2 block text-sm font-medium text-slate-200">
						Question text
					</label>
					<input
						type="text"
						value={question.question}
						onChange={(event) => onQuestionChange(event.target.value)}
						placeholder="What should we improve next?"
						className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
					/>
				</div>

				<div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
					<div>
						<p className="text-sm font-medium text-white">Required question</p>
						<p className="text-xs text-slate-400">
							Respondents must answer this question.
						</p>
					</div>
					<button
						type="button"
						onClick={onToggleRequired}
						className={[
							"relative inline-flex h-8 w-14 items-center rounded-full transition",
							question.required ? "bg-cyan-400" : "bg-slate-700",
						].join(" ")}
					>
						<span
							className={[
								"inline-block h-6 w-6 rounded-full bg-white transition",
								question.required ? "translate-x-7" : "translate-x-1",
							].join(" ")}
						/>
					</button>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-sm font-medium text-white">Options</p>
							<p className="text-xs text-slate-400">
								Use at least two choices.
							</p>
						</div>
						<button
							type="button"
							onClick={onAddOption}
							className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/10"
						>
							Add option
						</button>
					</div>

					{question.options.map((option, optionIndex) => (
						<OptionInput
							key={option.id}
							value={option.text}
							placeholder={`Option ${optionIndex + 1}`}
							onChange={(event) =>
								onOptionChange(option.id, event.target.value)
							}
							onRemove={() => onRemoveOption(option.id)}
							canRemove={question.options.length > 2}
						/>
					))}
				</div>
			</div>

			{error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
		</section>
	);
};

export default QuestionCard;
