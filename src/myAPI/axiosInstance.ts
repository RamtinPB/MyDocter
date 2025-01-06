import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "*/*",
	},
});

// Add request interceptor to include JWT token
axiosInstance.interceptors.request.use(
	(config) => {
		const jwToken = localStorage.getItem("jwToken"); // Assuming jwToken is stored in localStorage
		if (jwToken) {
			config.headers.Authorization = `Bearer ${jwToken}`; // Adds token to the Authorization header as Bearer token
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const configureAxios = (
	setAuthData: (token: null) => void,
	setLoginState: (state: boolean) => void
) => {
	let isLoggedOut = false; // Centralized variable to prevent multiple redirects

	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (
				error.response &&
				error.response.status === 401 &&
				!isLoggedOut
			) {
				isLoggedOut = true; // Set flag to prevent multiple executions
				setAuthData(null); // Clear token data
				setLoginState(false); // Immediately set login state to false
				if (window.location.pathname !== "/") {
					window.location.assign("/"); // Redirect to login page
				}

				// Optional: reset the flag after a delay to prevent issues with subsequent errors
				setTimeout(() => {
					isLoggedOut = false;
				}, 500); // Adjust delay as needed
			}
			return Promise.reject(error);
		}
	);
};

export default axiosInstance;
