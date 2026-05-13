import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";

const Login = () => {
	const { currentUser, loading, loginWithGoogle } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/dashboard";

	useEffect(() => {
		if (currentUser) {
			navigate(from, { replace: true });
		}
	}, [currentUser, from, navigate]);

	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
			toast.success("Signed in");
			navigate(from, { replace: true });
		} catch (error) {
      console.error("Google login failed", error);
			toast.error("Google login failed");
		}
	};

	if (loading) {
		return (
			<Loader
				fullScreen
				label="Preparing login..."
			/>
		);
	}

	return (
		<div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
			<div className="space-y-5">
				<p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-200">
					Secure access
				</p>
				<h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
					Sign in to manage your polls and analytics.
				</h1>
				<p className="max-w-xl text-lg leading-8 text-slate-300">
					Google login is enabled for the frontend. Firebase keeps the session
					and backend token flow consistent.
				</p>
				<div className="flex flex-wrap gap-3 text-sm text-slate-400">
					<span className="rounded-full border border-white/10 px-4 py-2">
						Google Authentication
					</span>
					<span className="rounded-full border border-white/10 px-4 py-2">
						Axios token attachment
					</span>
					<span className="rounded-full border border-white/10 px-4 py-2">
						Protected routes
					</span>
				</div>
			</div>

			<div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
				<div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
					<h2 className="text-2xl font-semibold text-white">
						Continue with Google
					</h2>
					<p className="text-sm leading-6 text-slate-400">
						Use your Google account to access the creator dashboard and
						connected poll tools.
					</p>
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
					>
						Sign in with Google
					</button>
					<p className="text-xs leading-5 text-slate-500">
						By signing in, the frontend syncs your Firebase token to the backend
						user record.
					</p>
					<Link
						to="/"
						className="block text-center text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
					>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
