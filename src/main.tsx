import ReactDOM from "react-dom/client";
import AppInitializer from "./components/AppInitializer.tsx"; // Import your new initializer
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.css";
import { LanguageProvider } from "./components/LanguageContext.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<LanguageProvider>
		<AuthProvider>
			<AppInitializer>
				<App />
			</AppInitializer>
		</AuthProvider>
	</LanguageProvider>
);
