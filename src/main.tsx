import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.css";

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
