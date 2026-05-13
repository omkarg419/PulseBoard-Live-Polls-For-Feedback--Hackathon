const StatsCard = ({ label, value, description }) => {
	return (
		<div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
			<p className="text-sm text-slate-400">{label}</p>
			<p className="mt-2 text-3xl font-semibold tracking-tight text-white">
				{value}
			</p>
			{description ? (
				<p className="mt-2 text-sm text-slate-500">{description}</p>
			) : null}
		</div>
	);
};

export default StatsCard;
