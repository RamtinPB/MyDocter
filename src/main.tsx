import ReactDOM from "react-dom/client";
import AppInitializer from "./components/AppInitializer.tsx"; // Import your new initializer
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.css";
import { LanguageProvider } from "./components/LanguageContext.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";
import { ProfileProvider } from "./components/ProfileContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<LanguageProvider>
		<AuthProvider>
			<AppInitializer>
				<ProfileProvider>
					<App />
				</ProfileProvider>
			</AppInitializer>
		</AuthProvider>
	</LanguageProvider>
);
