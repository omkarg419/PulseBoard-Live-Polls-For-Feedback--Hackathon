const Loader = ({ label = "Loading...", fullScreen = false }) => {
	return (
		<div
			className={[
				"grid gap-3 text-center text-slate-300",
				fullScreen
					? "min-h-[60vh] place-items-center"
					: "place-items-center py-12",
			].join(" ")}
		>
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/25 border-t-cyan-400" />
			<p className="text-sm">{label}</p>
		</div>
	);
};

export default Loader;
