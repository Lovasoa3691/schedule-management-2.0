import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";
import api from "../../hooks/api";
import Logo from "../../assets/calendar.png";
import Office from "../../assets/espace-de-travail.png";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    setIsFirstLogin(type === "first-login");
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!form.email) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez saisir votre email !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez saisir un email valide !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify-email", {
        email: form.email,
      });

      if (response.data.success) {
        setUserName(response.data.user.name || "Utilisateur");
        setEmailVerified(true);

        if (isFirstLogin) {
          Swal.fire({
            icon: "success",
            title: "Email vérifié",
            text: `Bienvenue ${response.data.user.name} ! Veuillez créer votre mot de passe pour activer votre compte.`,
            backdrop: "rgba(0,0,0,0.4)",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Email vérifié",
            text: `Ravis de vous voir ${response.data.user.name}, vous pouvez maintenant réinitialiser votre mot de passe.`,
            backdrop: "rgba(0,0,0,0.4)",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Email non trouvé",
          text:
            response.data.message ||
            "Cet email n'existe pas dans notre système.",
          backdrop: "rgba(0,0,0,0.4)",
        });
      }
    } catch (error) {
      let errorMessage = "Erreur lors de la vérification de l'email";
      if (error.response?.status === 404) {
        errorMessage = "Cet email n'existe pas dans notre système.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        backdrop: "rgba(0,0,0,0.4)",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!form.password || form.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit contenir au moins 6 caractères !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas !",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      if (response.data.success) {
        if (isFirstLogin) {
          Swal.fire({
            icon: "success",
            title: "Compte activé !",
            text: "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
            backdrop: "rgba(0,0,0,0.4)",
          }).then(() => {
            window.location.href = "/login";
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Votre mot de passe a été réinitialisé avec succès !",
            backdrop: "rgba(0,0,0,0.4)",
          }).then(() => {
            window.location.href = "/login";
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: response.data.message || "Erreur lors de la réinitialisation",
          backdrop: "rgba(0,0,0,0.4)",
        });
      }
    } catch (error) {
      let errorMessage = "Erreur lors de la réinitialisation";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join(", ");
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMessage,
        backdrop: "rgba(0,0,0,0.4)",
      });
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isFirstLogin
    ? "Activation de compte"
    : "Réinitialisation mot de passe";
  const formTitle = emailVerified
    ? isFirstLogin
      ? "Créer votre mot de passe"
      : "Nouveau mot de passe"
    : isFirstLogin
      ? "Vérification de compte"
      : "Mot de passe oublié";

  const buttonText = emailVerified
    ? isFirstLogin
      ? "Activer mon compte"
      : "Réinitialiser mon mot de passe"
    : isFirstLogin
      ? "Vérifier mon compte"
      : "Vérifier mon email";

  return (
    <div className="flex items-center justify-center min-h-screen animate-gradientBG">
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
              {pageTitle}
            </h2>

            {!emailVerified ? (
              <form onSubmit={handleVerifyEmail} className="space-y-5">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-[#333333] ">
                    -- Email --
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
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      id="email-address-icon"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                      placeholder="exemple@gmail.com"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Note :</span>
                    {isFirstLogin
                      ? "Veuillez saisir votre email pour activer votre compte et créer votre mot de passe."
                      : "Veuillez saisir votre email pour vérifier votre identité et réinitialiser votre mot de passe."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-[#F2EDE8] font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5 text-center transition"
                >
                  {loading
                    ? isFirstLogin
                      ? "Vérification..."
                      : "Vérification..."
                    : buttonText}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-[#333333] ">
                    -- Email --
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
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      id="email-address-icon"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                      placeholder="exemple@gmail.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-1 text-gray-600">
                    --{" "}
                    {isFirstLogin
                      ? "Créer un mot de passe"
                      : "Nouveau mot de passe"}{" "}
                    --
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
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="********"
                      id="email-address-icon"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 caractères
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-1 text-gray-600">
                    -- Confirmer le mot de passe --
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
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="********"
                      id="email-address-icon"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 caractères
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-[#F2EDE8] font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5 text-center transition"
                >
                  {loading
                    ? isFirstLogin
                      ? "Activation..."
                      : "Réinitialisation..."
                    : buttonText}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailVerified(false);
                    setForm({ email: "", password: "", confirmPassword: "" });
                    setUserName("");
                  }}
                  disabled={loading}
                  className="w-full py-2 border border-[#7A0000] text-[#7A0000] font-semibold rounded-lg hover:bg-[#7A0000]/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Retour
                </button>
              </form>
            )}
            <p className="mt-4 text-center text-[#333333]">
              {isFirstLogin ? "Déjà un compte ? " : "Retour à la "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                {isFirstLogin ? "Se connecter" : "Page de connexion"}
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-blue-700 relative justify-center items-center">
          <img src={Office} className="w-80 h-80" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/70 rounded-full" />
        </div>
      </div>
    </div>
  );
}
