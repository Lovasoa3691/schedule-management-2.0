import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/utilisateur/profile") &&
      !error.config.url.includes("/login")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
