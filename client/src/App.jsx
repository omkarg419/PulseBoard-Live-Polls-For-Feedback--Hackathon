import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AppRoutes />
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							background: "#0f172a",
							color: "#e2e8f0",
							border: "1px solid rgba(255,255,255,0.08)",
						},
					}}
				/>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
