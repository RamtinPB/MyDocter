// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { configureAxios } from "../myAPI/axiosInstance";

interface AuthContextType {
	jwToken: string | null;
	accessLevel: string | undefined | null;
	setAuthData: (token: string | null, accLvl?: string) => void;
	loginState: boolean;
	setLoginState: (state: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to check if JWT is expired
const isTokenExpired = (jwToken: string) => {
	if (!jwToken) return true;
	const payload = JSON.parse(atob(jwToken.split(".")[1]));
	const expiry = payload.exp * 1000; // Convert to milliseconds
	return Date.now() > expiry;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [jwToken, setJwToken] = useState<string | null>(null);
	const [accessLevel, setaccessLevel] = useState<string | undefined | null>(
		undefined
	);
	const [loginState, setLoginState] = useState(false);

	useEffect(() => {
		const storedToken = localStorage.getItem("jwToken");
		const storedaccLvl = localStorage.getItem("accessLevel");
		if (storedToken && !isTokenExpired(storedToken)) {
			setJwToken(storedToken);
			setaccessLevel(storedaccLvl);
			setLoginState(true); // Set loginState to true if token exists
		} else {
			setLoginState(false);
		}
		// Configure Axios to update loginState on 401 errors
		configureAxios(setAuthData, setLoginState);
	}, []);

	const setAuthData = (
		token: string | null,
		accLvl?: string | undefined | null
	) => {
		if (token === null) {
			setJwToken(null);
			setaccessLevel(null);
			localStorage.removeItem("jwToken");
			localStorage.removeItem("accessLevel");
			setLoginState(false); // Set login state to false on logout
		} else {
			setJwToken(token);
			setaccessLevel(accLvl);
			localStorage.setItem("jwToken", token);
			localStorage.setItem("accessLevel", String(accLvl));
			setLoginState(true); // Set login state to true on login
		}
	};

	return (
		<AuthContext.Provider
			value={{
				jwToken,
				accessLevel,
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
