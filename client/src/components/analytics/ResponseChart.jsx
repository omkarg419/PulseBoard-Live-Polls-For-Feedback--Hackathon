import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import EmptyState from "../common/EmptyState";
import AnalyticsCard from "./AnalyticsCard";

const chartTheme = {
	backgroundColor: "rgba(15, 23, 42, 0.95)",
	borderColor: "rgba(255, 255, 255, 0.08)",
	color: "#e2e8f0",
};

const ResponseChart = ({ summary }) => {
	if (!summary) {
		return (
			<AnalyticsCard title="Response breakdown">
				<EmptyState
					title="No chart data yet"
					description="Add a poll and collect responses to see option-level vote patterns here."
				/>
			</AnalyticsCard>
		);
	}

	const data = summary.options.map((option) => ({
		name: option.text,
		votes: option.votes,
	}));

	return (
		<AnalyticsCard
			title="Response breakdown"
			subtitle={summary.question}
		>
			<div className="h-80">
				<ResponsiveContainer
					width="100%"
					height="100%"
				>
					<BarChart
						data={data}
						margin={{ top: 12, right: 12, left: 0, bottom: 32 }}
					>
						<CartesianGrid
							stroke="rgba(255,255,255,0.06)"
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							tick={{ fill: chartTheme.color, fontSize: 12 }}
							axisLine={{ stroke: chartTheme.borderColor }}
							tickLine={false}
							interval={0}
							angle={-14}
							textAnchor="end"
						/>
						<YAxis
							tick={{ fill: chartTheme.color, fontSize: 12 }}
							axisLine={{ stroke: chartTheme.borderColor }}
							tickLine={false}
						/>
						<Tooltip
							cursor={{ fill: "rgba(34, 211, 238, 0.08)" }}
							contentStyle={{
								backgroundColor: chartTheme.backgroundColor,
								borderColor: chartTheme.borderColor,
								color: chartTheme.color,
								borderRadius: "16px",
							}}
						/>
						<Bar
							dataKey="votes"
							fill="#22d3ee"
							radius={[10, 10, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</AnalyticsCard>
	);
};

export default ResponseChart;
