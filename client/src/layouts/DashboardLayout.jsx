import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100 lg:flex">
			<Sidebar />
			<main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;
