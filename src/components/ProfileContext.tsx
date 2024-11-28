import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileContextType {
	profileImageVersion: number; // Use a version number to track updates
	triggerImageUpdate: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const [profileImageVersion, setProfileImageVersion] = useState(0);

	const triggerImageUpdate = async () => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		setProfileImageVersion((prev) => prev + 1);
	};

	return (
		<ProfileContext.Provider
			value={{ profileImageVersion, triggerImageUpdate }}
		>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = () => {
	const context = useContext(ProfileContext);
	if (!context) {
		throw new Error("useProfile must be used within a ProfileProvider");
	}
	return context;
};
