import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import useAuth from "../../hooks/useAuth";
import { APP_NAME } from "../../utils/constants";

const linkBase =
	"rounded-full border border-white/10 px-4 py-2 text-sm font-medium transition hover:border-cyan-400/40 hover:bg-cyan-400/10";

const Navbar = () => {
	const { currentUser, logoutUser } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutUser();
			toast.success("Signed out");
			navigate("/");
		} catch (error) {
      console.error("Logout failed", error);
			toast.error("Could not sign out");
		}
	};

	return (
		<header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white"
				>
					<span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-400/20">
						PB
					</span>
					<span>{APP_NAME}</span>
				</Link>

				<div className="flex items-center gap-2">
					{currentUser ? (
						<>
							<NavLink
								to="/dashboard"
								className={linkBase}
							>
								Dashboard
							</NavLink>
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
							>
								Logout
							</button>
						</>
					) : (
						<NavLink
							to="/login"
							className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
						>
							Login
						</NavLink>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;
