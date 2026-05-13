import { Link } from "react-router-dom";

const EmptyState = ({
	title,
	description,
	actionLabel,
	actionTo,
	onAction,
}) => {
	return (
		<div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center shadow-2xl shadow-slate-950/20">
			<h3 className="text-xl font-semibold text-white">{title}</h3>
			<p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
				{description}
			</p>

			{actionLabel ? (
				actionTo ? (
					<Link
						to={actionTo}
						className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						{actionLabel}
					</Link>
				) : (
					<button
						type="button"
						onClick={onAction}
						className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						{actionLabel}
					</button>
				)
			) : null}
		</div>
	);
};

export default EmptyState;
