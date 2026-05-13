import { NavLink } from "react-router-dom";

import { APP_NAME, NAV_LINKS } from "../../utils/constants";

const Sidebar = () => {
	const linkClass = ({ isActive }) =>
		[
			"flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
			isActive
				? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30"
				: "text-slate-300 hover:bg-white/5 hover:text-white",
			
		].join(" ");

	return (
		<aside className="border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
			<div className="mb-6 flex items-center gap-3">
				<span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-bold text-slate-950">
					PB
				</span>
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-slate-400">
						Workspace
					</p>
					<h2 className="text-lg font-semibold text-white">{APP_NAME}</h2>
				</div>
			</div>

			<nav className="grid gap-2">
				{NAV_LINKS.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						className={linkClass}
					>
						<span>{link.label}</span>
					</NavLink>
				))}

				<NavLink
					to="/dashboard"
					className={linkClass}
				>
					<span>Analytics</span>
					<span className="text-xs text-slate-500">Open from a poll</span>
				</NavLink>
			</nav>
		</aside>
	);
};

export default Sidebar;
