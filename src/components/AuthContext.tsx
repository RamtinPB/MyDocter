// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
	jwToken: string | null;
	isAdministrator: boolean;
	setAuthData: (token: string | null, isAdmin?: boolean) => void;
	loginState: boolean;
	setLoginState: (state: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [jwToken, setJwToken] = useState<string | null>(null);
	const [isAdministrator, setIsAdministrator] = useState(false);
	const [loginState, setLoginState] = useState(false);

	useEffect(() => {
		const storedToken = localStorage.getItem("jwToken");
		const storedIsAdmin = localStorage.getItem("isAdministrator") === "true";
		if (storedToken) {
			setJwToken(storedToken);
			setIsAdministrator(storedIsAdmin);
			setLoginState(true); // Set loginState to true if token exists
		} else {
			setLoginState(false);
		}
	}, []);

	const setAuthData = (token: string | null, isAdmin: boolean = false) => {
		if (token === null) {
			setJwToken(null);
			setIsAdministrator(false);
			localStorage.removeItem("jwToken");
			localStorage.removeItem("isAdministrator");
			setLoginState(false); // Set login state to false on logout
		} else {
			setJwToken(token);
			setIsAdministrator(isAdmin);
			localStorage.setItem("jwToken", token);
			localStorage.setItem("isAdministrator", String(isAdmin));
			setLoginState(true); // Set login state to true on login
		}
	};

	return (
		<AuthContext.Provider
			value={{
				jwToken,
				isAdministrator,
				setAuthData,
				loginState,
				setLoginState,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
