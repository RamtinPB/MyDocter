import React, { useEffect, ReactNode } from "react";
import { configureAxios } from "../myAPI/axiosInstance.ts"; // Adjust this import path as needed
import { useAuth } from "../components/AuthContext";

// Define props type for the AppInitializer component
interface AppInitializerProps {
	children: ReactNode; // Use ReactNode for children prop
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
	const { setAuthData, setLoginState } = useAuth();

	useEffect(() => {
		configureAxios(setAuthData, setLoginState);
	}, [setAuthData, setLoginState]);

	return <>{children}</>; // Render child components (like <App />)
};

export default AppInitializer;
