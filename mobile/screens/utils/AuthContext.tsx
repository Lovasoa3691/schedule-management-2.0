// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("jwt");
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("jwt");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated: setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
