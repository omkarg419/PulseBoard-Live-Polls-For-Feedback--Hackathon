import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { formatDate } from "../../utils/formatDate";

const PollCard = ({ poll, onPublish }) => {
	const pollId = poll._id || poll.id;
	const [currentTime, setCurrentTime] = useState(() => Date.now());
	const expiresAt = poll.expiresAt ? new Date(poll.expiresAt).getTime() : null;

	useEffect(() => {
		if (!expiresAt) {
			return undefined;
		}

		const msUntilExpiry = expiresAt - Date.now();
		if (msUntilExpiry <= 0) {
			setCurrentTime(Date.now());
			return undefined;
		}

		const timeoutId = setTimeout(() => {
			setCurrentTime(Date.now());
		}, msUntilExpiry + 50);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [expiresAt, poll.status]);

	const isExpired =
		poll.status === "expired" ||
		(expiresAt !== null && expiresAt <= currentTime);
	const canPublish = isExpired && !poll.isPublished;

	const copyLink = async () => {
		const link = `${window.location.origin}/poll/${pollId}`;

		try {
			await navigator.clipboard.writeText(link);
			toast.success("Poll link copied");
		} catch (error) {
			toast.error("Unable to copy link");
		}
	};

	return (
		<article className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-xl font-semibold text-white">{poll.title}</h3>
						{poll.isPublished ? (
							<span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">
								Published
							</span>
						) : (
							<span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
								Draft
							</span>
						)}
						<span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-400">
							{poll.status}
						</span>
					</div>
					<p className="max-w-3xl text-sm leading-6 text-slate-400">
						{poll.description || "No description provided."}
					</p>
				</div>

				<div className="grid gap-2 text-sm text-slate-300 sm:text-right">
					<p>
						{poll.questions?.length || 0} question
						{poll.questions?.length === 1 ? "" : "s"}
					</p>
					<p>
						{poll.totalResponses || 0} response
						{(poll.totalResponses || 0) === 1 ? "" : "s"}
					</p>
					<p>Expires {formatDate(poll.expiresAt)}</p>
				</div>
			</div>

			<div className="mt-5 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={copyLink}
					className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-white/5"
				>
					Copy link
				</button>

				<Link
					to={`/analytics/${pollId}`}
					className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-white/5"
				>
					Analytics
				</Link>

				{canPublish ? (
					<button
						type="button"
						onClick={() => onPublish(pollId)}
						className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						Publish results
					</button>
				) : null}

				{!canPublish && !poll.isPublished ? (
					<span className="text-sm text-slate-500">
						Poll results can be published after expiry.
					</span>
				) : null}
			</div>
		</article>
	);
};

export default PollCard;
