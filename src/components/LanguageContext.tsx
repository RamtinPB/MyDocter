import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the context
interface LanguageContextType {
	language: string;
	toggleLanguage: (lang: string) => void;
}

// Create LanguageContext with default values
const LanguageContext = createContext<LanguageContextType>({
	language: "fa", // Default to Farsi
	toggleLanguage: () => {}, // Placeholder function
});

// Language Provider
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState("fa"); // Default to Farsi

	useEffect(() => {
		const savedLanguage = localStorage.getItem("language");
		if (savedLanguage) {
			setLanguage(savedLanguage);
		}
	}, []);

	const toggleLanguage = (lang: string) => {
		setLanguage(lang);
		localStorage.setItem("language", lang);
	};

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};

// Custom hook to use the LanguageContext
export const useLanguage = () => useContext(LanguageContext);
