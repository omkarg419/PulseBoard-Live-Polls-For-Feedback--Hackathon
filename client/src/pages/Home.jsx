import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const highlights = [
	{
		title: "Live response tracking",
		description:
			"See response counts and question breakdowns update in near real time.",
	},
	{
		title: "Secure auth flow",
		description:
			"Firebase Authentication keeps poll creation and analytics protected.",
	},
	{
		title: "Hackathon-ready UX",
		description:
			"A clean responsive interface that is simple to extend and ship.",
	},
];

const Home = () => {
	const { currentUser } = useAuth();

	return (
		<div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
			<section className="space-y-8">
				<div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
					Polls and feedback in one command center
				</div>

				<div className="space-y-5">
					<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
						Run live polls, collect feedback, and watch answers evolve in real
						time.
					</h1>
					<p className="max-w-2xl text-lg leading-8 text-slate-300">
						PulseBoard gives you a production-style React frontend for creating
						polls, viewing response analytics, and keeping every stakeholder on
						the same page.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<Link
						to={currentUser ? "/dashboard" : "/login"}
						className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						{currentUser ? "Open dashboard" : "Start with Google login"}
					</Link>
					<Link
						to="/create-poll"
						className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/5"
					>
						Create a poll
					</Link>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					{highlights.map((item) => (
						<div
							key={item.title}
							className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/20"
						>
							<h3 className="text-base font-semibold text-white">
								{item.title}
							</h3>
							<p className="mt-2 text-sm leading-6 text-slate-400">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
				<div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(34,211,238,0.16),_rgba(15,23,42,0.9))] p-6">
					<p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
						PulseBoard stack
					</p>
					<div className="mt-4 grid gap-4">
						<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
							<p className="text-sm text-slate-400">Realtime socket feed</p>
							<p className="mt-1 text-lg font-semibold text-white">
								Response events stream in instantly.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
							<p className="text-sm text-slate-400">Analytics snapshot</p>
							<p className="mt-1 text-lg font-semibold text-white">
								Track totals, vote splits, and participation insights.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
							<p className="text-sm text-slate-400">Firebase auth</p>
							<p className="mt-1 text-lg font-semibold text-white">
								Secure access for creators and responders.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
