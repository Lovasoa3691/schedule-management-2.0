import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  email?: string;
  role?: string;
  nom?: string;
  prenom?: string;
}

const getUserIdFromToken = async (): Promise<JwtPayload | null> => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    // console.log("Decoded JWT:", decoded);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.log("Erreur décodage JWT:", err);
    return null;
  }
};

export { getUserIdFromToken };
