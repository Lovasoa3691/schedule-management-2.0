import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/calendar.png";
import Office from "../../assets/espace-de-travail.png";
import { useState } from "react";
import { FileWarning, XCircle } from "lucide-react";
import api from "../../hooks/api";

const Login = ({ setIsAuthentificated }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    email: "",
    mdp: "",
    client: "web",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const rep = await api.post("/utilisateur/login", user);
      if (rep.data) {
        setIsAuthentificated(true);
        navigate("/dashboard");
      }
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary/90 animate-gradientBG">
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[420px] text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <XCircle className="text-red-600 w-10 h-10 animate-pulse" />
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
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex w-full md:w-1/2 items-center justify-center bg-slate-100 p-10">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6">
              <img src={Logo} className="w-32 h-32 mb-2 text-white" />
              <span className="text-[#333333] font-bold text-3xl">
                Sched<span className="text-blue-600">Connect</span>
              </span>
            </div>

            <h2 className="text-xl font-semibold text-center text-[#333333] mb-4">
              Connectez-vous à votre compte
            </h2>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-[#333333] ">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                    placeholder="exemple@gmail.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-[#333333] ">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
                  />
                </div>
              </div>

              <p className="mt-4 mb-6 text-end text-[#333333]">
                <Link
                  to="/forgotPassword"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Mot de passe oublié?{" "}
                </Link>

                <span className="text-gray-500 mx-2">•</span>

                <Link
                  to="/forgotPassword?type=first-login"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Première connexion?
                </Link>
              </p>

              <button
                disabled={loading}
                type="submit"
                className="w-full text-[#F2EDE8] font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5 text-center transition"
              >
                {loading ? (
                  <div
                    role="status"
                    className="flex items-center justify-center"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <span>Se Connecter</span>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 bg-blue-600 relative justify-center items-center">
          <img src={Office} className="w-80 h-80" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
