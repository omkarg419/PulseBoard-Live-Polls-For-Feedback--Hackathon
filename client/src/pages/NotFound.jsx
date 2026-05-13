import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="grid min-h-[70vh] place-items-center">
			<div className="max-w-2xl rounded-4xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/30">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
					404
				</p>
				<h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
					Page not found
				</h1>
				<p className="mt-4 text-sm leading-6 text-slate-400">
					The page you were looking for does not exist or was moved.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<Link
						to="/"
						className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						Go home
					</Link>
					<Link
						to="/dashboard"
						className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/5"
					>
						Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
