import { FiBell, FiChevronDown, FiMessageSquare } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";
import { FiCamera } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { Loader } from "./spin/Spinner";

const Avatar = ({ user, avatar, setAvatar }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    // 👉 plus tard : upload vers backend
    // const formData = new FormData();
    // formData.append("avatar", file);
    // api.post("/utilisateur/avatar", formData);
  };

  return (
    <div className="relative w-12 h-12">
      <label htmlFor="avatar-upload" className="cursor-pointer">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <FaUser className="w-12 h-12 text-gray-300 rounded-full border" />
        )}
      </label>
    </div>
  );
};

const LogoutLoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <Loader/>
        </div>

        <h2 className="text-lg font-semibold text-gray-800">
          Déconnexion en cours…
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Veuillez patienter quelques secondes
        </p>
      </div>
    </div>
  );
};

const TopBar = ({ setIsAuthenticated }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [isLoginOut, setIsLoginOut] = useState(false);

  useEffect(() => {
    api
      .get("/utilisateur/profile")
      .then((res) => {
        console.log(res.data);
        setId(res.data.userId);
        setRole(res.data.userRole);
      })
      .catch((err) => console.error("Erreur de recuperation: ", err));
  }, []);

  const getUser = (key) => {
    api
      .get(`/utilisateur/${key}/${role}`)
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => console.error("Erreur de recuperation: ", err));
  };

  useEffect(() => {
    if (id && role) {
      getUser(id);
    }
  }, [id, role]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoginOut(true);
    setTimeout(async () => {
      try {
        await api.post("/utilisateur/logout", role, {
          headers: { "Content-Type": "application/json" },
        });
        setIsAuthenticated(false);
        navigate("/login");
      } catch (err) {
        console.error("Erreur lors de la déconnexion :", err.response.data);
      } finally {
        setIsLoginOut(false);
      }
    }, 3000);
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
    <header className="bg-blue-600 shadow top-0 left-0 right-0 z-10 fixed">
      {
        isLoginOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <LogoutLoadingModal isOpen={isLoginOut} />
      </div>
        )
      }
      
      <div className="px-4 py-4 z-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 px-3 py-1">
          <h1 className="text-3xl font-bold text-gray-100">
            Sched<span className="text-blue-200">Connect</span>{" "}
          </h1>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div
            className="relative cursor-pointer"
            onClick={handleMessagesClick}
          >
            <FiMessageSquare className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              4
            </span>
          </div>
          <div
            className="relative cursor-pointer"
            onClick={handleNotificationsClick}
          >
            <FiBell className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
              3
            </span>
          </div>

          <div className="w-px h-8 bg-gray-100 mx-4"></div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-800 font-medium focus:outline-none"
            >
              
              <Avatar user={user} avatar={null} setAvatar={() => {}} />

              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-md text-white">
                  {user[0]?.email ?? "N/A"}
                </span>
                <span className="text-sm text-white capitalize">
                  {user[0]?.role ?? "utilisateur"}
                </span>
              </div>

              <FiChevronDown className="w-4 h-4 text-white" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
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
