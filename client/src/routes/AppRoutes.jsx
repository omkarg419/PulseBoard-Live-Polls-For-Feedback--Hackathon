import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Analytics from "../pages/Analytics";
import CreatePoll from "../pages/CreatePoll";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PublicPoll from "../pages/PublicPoll";

const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route
					index
					element={<Home />}
				/>
				<Route
					path="login"
					element={<Login />}
				/>
				<Route
					path="poll/:pollId"
					element={<PublicPoll />}
				/>
			</Route>

			<Route element={<ProtectedRoute />}>
				<Route element={<DashboardLayout />}>
					<Route
						path="dashboard"
						element={<Dashboard />}
					/>
					<Route
						path="create-poll"
						element={<CreatePoll />}
					/>
					<Route
						path="analytics/:pollId"
						element={<Analytics />}
					/>
				</Route>
			</Route>

			<Route
				path="*"
				element={<NotFound />}
			/>
		</Routes>
	);
};

export default AppRoutes;
