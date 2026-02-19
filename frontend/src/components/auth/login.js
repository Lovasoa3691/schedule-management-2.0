import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/calendar.png";
import { useState } from "react";
import { FileWarning } from "lucide-react";
import api from "../../hooks/api";

const Login = ({ setIsAuthentificated }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    mdp: "",
    client: "web",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .post("/utilisateur/login", user)
      .then((rep) => {
        // console.log(rep.data);
        setIsAuthentificated(true);
        navigate("/dashboard");
      })
      .catch((err) => {
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Erreur serveur:", err.response.data);
          setError(err.response.data);
          setShowAlert(true);
        } else {
          console.error("Erreur:", err.message);
          setError(err.message);
          setShowAlert(true);
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="login-container h-screen flex flex-col items-center justify-center bg-slate-50">
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
        <div className="logo mb-4">
          <div className="p-4 text-center text-white flex flex-col items-center justify-center w-full h-20 mb-8 text-3xl">
            <img src={Logo} className="w-32 h-32 mb-2 text-white" />
            <span className="text-gray-900 font-bold">
              Sched<span className="text-blue-600">Connect</span>
            </span>
          </div>
        </div>

        <span className="text-xl font-bold mb-8">
          Connectez-vous à votre compte
        </span>
      </div>

      <div className="bg-white rounded-lg p-8 w-full max-w-md rounded:bg-gray-100 shadow-md">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                name="email"
                value={user.email}
                onChange={handleChange}
                id="email-address-icon"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="exemple@gmail.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm3 8V6a3 3 0 1 0-6 0v3h6Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="mdp"
                value={user.mdp}
                onChange={handleChange}
                placeholder="********"
                id="email-address-icon"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span>
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Se souvenir de moi
              </label>
            </span>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Se connecter
          </button>
        </form>
        <span className="flex items-center justify-center text-gray-700">
          <span>
            Vous n'avez pas encore un compte?{" "}
            <Link to={"/register"} className="underline text-blue-500">
              Creez-en une
            </Link>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Login;
