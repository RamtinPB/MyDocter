import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the Auth context
interface AuthContextType {
	jwToken: string | null;
	isAdministrator: boolean;
	setAuthData: (token: string, isAdmin: boolean) => void;
}

// Create AuthContext with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [jwToken, setJwToken] = useState<string | null>(null);
	const [isAdministrator, setIsAdministrator] = useState(false);

	useEffect(() => {
		const storedToken = localStorage.getItem("jwToken");
		const storedIsAdmin = localStorage.getItem("isAdministrator") === "true";
		if (storedToken) {
			setJwToken(storedToken);
			setIsAdministrator(storedIsAdmin);
		}
	}, []);

	const setAuthData = (token: string, isAdmin: boolean) => {
		setJwToken(token);
		setIsAdministrator(isAdmin);
		localStorage.setItem("jwToken", token);
		localStorage.setItem("isAdministrator", String(isAdmin));
	};

	return (
		<AuthContext.Provider value={{ jwToken, isAdministrator, setAuthData }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
