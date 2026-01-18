import {
  FiChevronDown,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";

const TopBar = ({ setIsAuthenticated }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [user, setUser] = useState(null);
  const [id, setId] = useState(() => {
    const storedKey = localStorage.getItem("user");
    return storedKey ? storedKey : null;
  });

  const getUser = (key) => {
    api
      .get(`/utilisateur/${key}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Erreur de recuperation: ", err));
  };

  useEffect(() => {
    if (id) {
      getUser(id);
      console.log(id);
    }
  }, [id]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/utilisateur/logout", "responsable", {
        headers: { "Content-Type": "application/json" },
      });

      setIsAuthenticated(false);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err.response.data);
    }
  };

  const handleMessagesClick = () => {
    const messages = [
      "Nouveau message de Jean.",
      "Rappel : réunion demain à 10h.",
      "Document partagé par Alice.",
      "Message de l’administration.",
    ];
    setToasts((prev) => [
      ...prev,
      ...messages.map((msg) => ({ id: Date.now() + Math.random(), text: msg })),
    ]);
  };

  const handleNotificationsClick = () => {
    const notifs = [
      "Nouvelle note ajoutée.",
      "Planning modifié.",
      "Mise à jour disponible.",
    ];
    setToasts((prev) => [
      ...prev,
      ...notifs.map((n) => ({ id: Date.now() + Math.random(), text: n })),
    ]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!user) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <header className="bg-white shadow top-0 left-0 right-0 z-10 fixed">
      <div className="px-4 py-4 z-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 px-3 py-1">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            SC
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Sched.<span className="text-blue-700">Connect</span>{" "}
          </h1>
        </div>

        <div className="flex items-center space-x-6 relative">
          {/* <div
            className="relative cursor-pointer"
            onClick={handleMessagesClick}
          >
            <FiMessageSquare className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              4
            </span>
          </div>

          <div
            className="relative cursor-pointer"
            onClick={handleNotificationsClick}
          >
            <FiBell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              3
            </span>
          </div> */}

          {/* Toast */}
          {/* <div className="fixed top-20 right-5 z-50 w-72">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.text}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div> */}

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 text-gray-800 font-medium focus:outline-none"
            >
              <span>{user?.email ?? "N/A"}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
