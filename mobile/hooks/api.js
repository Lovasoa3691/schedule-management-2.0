import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "https://covers-cubic-automation-nirvana.trycloudflare.com/api",
  // baseURL: "http://localhost:5142/api",
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Erreur récupération token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("jwt");
      // navigation.navigate("Login");
      console.log("Token expiré, utilisateur déconnecté");
    }
    return Promise.reject(error);
  },
);

export default api;
