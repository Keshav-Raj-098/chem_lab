import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
});

// Request interceptor to add the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // If data is FormData, let axios set the Content-Type with the boundary
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    } else if (config.headers && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/admin/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
