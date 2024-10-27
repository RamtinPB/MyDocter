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

export const configureAxios = (setAuthData: (token: null) => void, setLoginState: (state: boolean) => void) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear authentication data and update login state on 401
        setAuthData(null);
        setLoginState(false);
      }
      return Promise.reject(error);
    }
  );
};

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error making the request", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
