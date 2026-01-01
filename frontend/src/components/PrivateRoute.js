import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../hooks/api";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    api
      .get("/utilisateur/profile")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Chargement...</p>;

  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
