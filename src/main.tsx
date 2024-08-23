import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.css";
import { LanguageProvider } from "./components/LanguageContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<LanguageProvider>
		<App />
	</LanguageProvider>
);
