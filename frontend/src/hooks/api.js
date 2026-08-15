import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/user/profile") &&
      !error.config.url.includes("/login")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
