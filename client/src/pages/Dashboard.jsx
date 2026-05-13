import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import PollCard from "../components/poll/PollCard";
import StatsCard from "../components/analytics/StatsCard";
import useAuth from "../hooks/useAuth";
import { getPolls, publishPoll } from "../services/poll.service";

const Dashboard = () => {
	const { currentUser } = useAuth();
	const [polls, setPolls] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadPolls = useCallback(async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getPolls();
			setPolls(Array.isArray(data) ? data : data?.polls || data?.data || []);
		} catch (loadError) {
			setError(loadError?.response?.data?.message || "Failed to load polls");
			toast.error("Could not load dashboard data");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const fetchPolls = async () => {
			await loadPolls();
		};

		fetchPolls();
	}, [loadPolls]);

	const stats = useMemo(() => {
		const totalPolls = polls.length;
		const activePolls = polls.filter(
			(poll) => poll.status === "active" && poll.isPublished,
		).length;
		const totalResponses = polls.reduce(
			(sum, poll) => sum + (poll.totalResponses || 0),
			0,
		);

		return { totalPolls, activePolls, totalResponses };
	}, [polls]);

	const handlePublish = async (pollId) => {
		try {
			await publishPoll(pollId);
			toast.success("Poll published");
			await loadPolls();
		} catch (publishError) {
			toast.error(
				publishError?.response?.data?.message || "Unable to publish poll",
			);
		}
	};

	if (loading) {
		return (
			<Loader
				fullScreen
				label="Loading dashboard..."
			/>
		);
	}

	return (
		<div className="space-y-8">
			<section className="flex flex-col gap-4 rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
						Welcome back
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
						{currentUser?.displayName || currentUser?.email || "Your dashboard"}
					</h1>
					<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
						Track live polls, review response counts, and publish completed
						polls when they are ready.
					</p>
				</div>

				<Link
					to="/create-poll"
					className="inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
				>
					Create poll
				</Link>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				<StatsCard
					label="Total polls"
					value={stats.totalPolls}
					description="All polls created under your account."
				/>
				<StatsCard
					label="Active published polls"
					value={stats.activePolls}
					description="Live polls ready to receive responses."
				/>
				<StatsCard
					label="Total responses"
					value={stats.totalResponses}
					description="All responses collected across polls."
				/>
			</section>

			{error ? (
				<div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
					{error}
				</div>
			) : null}

			{polls.length === 0 ? (
				<EmptyState
					title="No polls yet"
					description="Create your first poll to start collecting feedback and viewing analytics."
					actionLabel="Create a poll"
					actionTo="/create-poll"
				/>
			) : (
				<section className="grid gap-4">
					{polls.map((poll) => (
						<PollCard
							key={poll._id || poll.id}
							poll={poll}
							onPublish={handlePublish}
						/>
					))}
				</section>
			)}
		</div>
	);
};

export default Dashboard;
