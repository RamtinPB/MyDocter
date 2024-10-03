import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: '*/*',
  },
});

// You can also add error handling here if necessary
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error making the request", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
