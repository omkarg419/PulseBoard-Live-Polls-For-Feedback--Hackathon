import { createContext, useEffect, useState } from "react";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { syncUser } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setLoading(true);

			if (user) {
				setCurrentUser(user);

				try {
					await syncUser();
				} catch (error) {
					console.error("Failed to sync Firebase user", error);
				}
			} else {
				setCurrentUser(null);
			}

			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	};

	const logoutUser = async () => {
		await signOut(auth);
	};

	const value = {
		currentUser,
		loading,
		loginWithGoogle,
		logoutUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
