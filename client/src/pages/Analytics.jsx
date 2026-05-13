import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import AnalyticsCard from "../components/analytics/AnalyticsCard";
import ResponseChart from "../components/analytics/ResponseChart";
import StatsCard from "../components/analytics/StatsCard";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import { formatDate } from "../utils/formatDate";
import { getAnalyticsByPollId } from "../services/analytics.service";

const Analytics = () => {
	const { pollId } = useParams();
	const { currentUser, loading: authLoading } = useAuth();
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadAnalytics = useCallback(async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getAnalyticsByPollId(pollId);
			setAnalytics(data);
		} catch (loadError) {
			setError(
				loadError?.response?.data?.message || "Unable to load analytics",
			);
			toast.error("Could not refresh analytics");
		} finally {
			setLoading(false);
		}
	}, [pollId]);

	useEffect(() => {
		
    if (!currentUser) return;

		const fetchAnalytics = async () => {
			await loadAnalytics();
		};

		fetchAnalytics();
	}, [currentUser, loadAnalytics]);

	const handleAnalyticsUpdate = useCallback((nextAnalytics) => {
		setAnalytics(nextAnalytics);
	}, []);

	useSocket({
		pollId,
		enabled: Boolean(currentUser),
		onAnalyticsUpdate: handleAnalyticsUpdate,
	});

	if (authLoading || (currentUser && loading)) {
		return (
			<Loader
				fullScreen
				label="Loading analytics..."
			/>
		);
	}

	if (!currentUser) {
		return (
			<EmptyState
				title="Sign in to view analytics"
				description="Poll analytics are protected for the creator account. Log in to see summaries and charts."
				actionLabel="Go to login"
				actionTo="/login"
			/>
		);
	}

	if (error) {
		return (
			<EmptyState
				title="Analytics unavailable"
				description={error}
				actionLabel="Back to dashboard"
				actionTo="/dashboard"
			/>
		);
	}

	if (!analytics) {
		return (
			<Loader
				fullScreen
				label="Preparing analytics..."
			/>
		);
	}

	return (
		<div className="space-y-8">
			<section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
					Analytics
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
					{analytics.poll.title}
				</h1>
				<p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
					View response totals, option votes, completion details, and
					participation insights for this poll.
				</p>
				<p className="mt-4 text-sm text-slate-500">
					Updated {formatDate(analytics.poll.expiresAt)}
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-4">
				<StatsCard
					label="Total responses"
					value={analytics.participationInsights.totalResponses}
				/>
				<StatsCard
					label="Anonymous responses"
					value={analytics.participationInsights.anonymousResponses}
				/>
				<StatsCard
					label="Completion rate"
					value={`${analytics.participationInsights.completionRate}%`}
				/>
				<StatsCard
					label="Average answers"
					value={analytics.participationInsights.averageAnswersPerResponse}
				/>
			</section>

			<ResponseChart summary={analytics.questionSummaries[0]} />

			<section className="grid gap-4">
				{analytics.questionSummaries.map((summary) => (
					<AnalyticsCard
						key={summary.questionId}
						title={summary.question}
						subtitle={`${summary.totalVotes} total votes`}
					>
						<div className="grid gap-3">
							{summary.options.map((option) => (
								<div
									key={option.optionId}
									className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
								>
									<div>
										<p className="text-sm font-medium text-white">
											{option.text}
										</p>
										<p className="text-xs text-slate-400">
											{option.percentage}% of votes
										</p>
									</div>
									<p className="text-sm font-semibold text-cyan-200">
										{option.votes}
									</p>
								</div>
							))}
						</div>
					</AnalyticsCard>
				))}
			</section>
		</div>
	);
};

export default Analytics;
