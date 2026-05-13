import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
	const { currentUser, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<Loader
				fullScreen
				label="Checking session..."
			/>
		);
	}

	if (!currentUser) {
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location }}
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
