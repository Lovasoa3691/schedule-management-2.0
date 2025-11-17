import React, { useState } from "react";
import Logo from "../../assets/calendar.png";
import { FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { FileWarning } from "lucide-react";

const Register = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
    genre: "",
    adresse: "",
    phone: "",
    fonction: "",
    confirmPassword: "",
    accepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.mdp !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setShowAlert(true);
      return;
    }

    if (!formData.accepted) {
      setError("Vous devez accepter les conditions.");
      setShowAlert(true);
      return;
    }

    axios
      .post(
        "http://localhost:5142/api/utilisateur/responsable/register",
        formData
      )
      .then((rep) => {
        setShowInfo(true);
      })
      .catch((err) => {
        if (err.response) {
          // console.error("Status:", err.response.status);
          // console.error("Erreur serveur:", err.response.data);
          setError(err.response.data);
          setShowAlert(true);
        } else {
          console.error("Erreur:", err.message);
          setError(err.message);
          setShowAlert(true);
        }
      });
  };

  return (
    <div className="login-container h-screen flex flex-col items-center justify-center bg-slate-100">
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[420px] text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Compte créé avec succès
            </h2>

            <p className="text-gray-600 mb-6">
              Votre compte a été créé. Vous pouvez maintenant vous connecter et
              profiter de nos services.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowInfo(false)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow hover:from-green-600 hover:to-green-700 transition"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[420px] text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <FileWarning className="text-red-600 w-10 h-10" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de connexion
            </h2>

            <p className="text-gray-600 mb-6">
              {error || "Une erreur est survenue. Veuillez réessayer."}
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowAlert(false)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow hover:from-red-600 hover:to-red-700 transition"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <div className="logo mb-6">
          <div className="p-4 text-center text-white flex flex-col items-center justify-center w-full h-20 mb-8 text-3xl">
            <img src={Logo} className="w-24 h-24 mb-2" alt="Logo" />
            <span className="text-gray-900 font-bold">
              Sched.<span className="text-blue-600">Connect</span>
            </span>
          </div>
        </div>

        <span className="text-xl font-bold mb-8">Créer un compte</span>
      </div>

      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Nom
            </label>
            <div className="relative">
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Votre prénom"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Mot de passe
            </label>
            <input
              type="password"
              name="mdp"
              value={formData.mdp}
              onChange={handleChange}
              placeholder="********"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Confirmez le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              id="accept"
              name="accepted"
              type="checkbox"
              checked={formData.accepted}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="accept" className="ml-2 text-sm text-gray-900">
              J'accepte les{" "}
              <a href="#" className="text-blue-600 underline">
                conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
