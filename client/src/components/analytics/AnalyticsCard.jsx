const AnalyticsCard = ({ title, subtitle, children, className = "" }) => {
	return (
		<section
			className={[
				"rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20",
				className,
			].join(" ")}
		>
			{title ? (
				<h3 className="text-lg font-semibold text-white">{title}</h3>
			) : null}
			{subtitle ? (
				<p className="mt-1 text-sm text-slate-400">{subtitle}</p>
			) : null}
			<div className="mt-4">{children}</div>
		</section>
	);
};

export default AnalyticsCard;
