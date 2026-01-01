import { FiLogOut, FiCalendar } from "react-icons/fi";
import {
  MdPerson,
  MdMenuBook,
  MdMeetingRoom,
  MdAnalytics,
  MdSettings,
  MdBarChart,
  MdExpandMore,
  MdGroup,
} from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaBook,
  FaDoorOpen,
  FaUser,
} from "react-icons/fa";
import { FiGrid, FiUser, FiHome } from "react-icons/fi";
import { GiBookshelf } from "react-icons/gi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

const Navbar = ({ setLoading }) => {
  const [openStats, setOpenStats] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("Tableau de bord");

  useEffect(() => {
    document.title = `Sched.Connect | ${currentPage}`;
  });

  const menuClick = (menu, path) => {
    setActive(menu);
    localStorage.setItem("menuActive", menu);
    nProgress.start();
    setCurrentPage(menu);
    setTimeout(() => {
      nProgress.done();
      navigate(path);
    }, 1000);
  };

  return (
    <div>
      <aside
        id="separator-sidebar"
        className="fixed top-0 left-0 z-1 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className=" flex-grow h-full px-3 py-4 overflow-y-auto bg-white dark:bg-slate-100">
          <nav className="mt-20">
            <h4 className="text-xs px-4 text-gray-800 uppercase tracking-wide mb-2">
              Accueil
            </h4>
            <ul>
              <li>
                <Link
                  onClick={() => menuClick("Dashboard", "/dashboard")}
                  className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                    active === "Dashboard"
                      ? " bg-slate-100 text-blue-600"
                      : " text-gray-800"
                  }`}
                >
                  <MdAnalytics className="w-5 h-5 mr-3 text-gray-800" />
                  Dashboard
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-xs px-4 text-gray-800 uppercase tracking-wide mb-2">
                Gestion
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    onClick={() => menuClick("Enseignant", "/enseignant")}
                    className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                      active === "Enseignant"
                        ? " bg-slate-100 text-blue-600"
                        : " text-gray-800"
                    }`}
                  >
                    <MdGroup className="w-5 h-5 mr-3 text-gray-800" />
                    Enseignants
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Matiere", "/matiere")}
                    className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                      active === "Matiere"
                        ? " bg-slate-100 text-blue-600"
                        : " text-gray-800"
                    }`}
                  >
                    <MdMenuBook className="w-5 h-5 mr-3 text-gray-800" />
                    Matieres
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Salle", "/salle")}
                    className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                      active === "Salle"
                        ? " bg-slate-100 text-blue-600"
                        : " text-gray-800"
                    }`}
                  >
                    <MdMeetingRoom className="w-5 h-5 mr-3 text-gray-800" />
                    Salles
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => menuClick("Planning", "/planning")}
                    className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                      active === "Planning"
                        ? " bg-slate-100 text-blue-600"
                        : " text-gray-800"
                    }`}
                  >
                    <FiCalendar className="w-5 h-5 mr-3 text-gray-800" />
                    Calendrier
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => setOpenStats(!openStats)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold text-left"
                  >
                    <div className="flex items-center">
                      <MdBarChart className="w-5 h-5 mr-3 text-gray-800" />
                      <span>Statistiques</span>
                    </div>
                    <MdExpandMore
                      className={`transform transition-transform duration-200 ${
                        openStats ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {openStats && (
                    <ul className="ml-12 mt-2 space-y-2 text-sm text-gray-700">
                      <li>
                        <Link
                          onClick={() =>
                            menuClick(
                              "Disponibilite",
                              "/statistique/disponibilite"
                            )
                          }
                          className={`block px-2 py-1 hover:text-blue-600${
                            active === "Disponibilite"
                              ? " text-blue-600"
                              : " text-gray-800"
                          }`}
                        >
                          Disponibilité
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() =>
                            menuClick(
                              "Heures",
                              "/statistique/heures-enseignants"
                            )
                          }
                          className={`block px-2 py-1 hover:text-blue-600${
                            active === "Heures"
                              ? " text-blue-600"
                              : " text-gray-800"
                          }`}
                        >
                          Heures enseignants
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h4 className="text-xs px-4 text-gray-800 uppercase tracking-wide mb-2">
                Fonctionnalités avancées
              </h4>
              <ul>
                <li>
                  <Link
                    onClick={() => menuClick("users", "/users")}
                    className={`flex items-center px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold${
                      active === "users"
                        ? " bg-slate-100 text-blue-600"
                        : " text-gray-800"
                    }`}
                  >
                    <MdPerson className="w-5 h-5 mr-3 text-gray-800" />
                    Utilisateurs
                  </Link>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setOpenSettings(!openSettings)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-slate-100 rounded-lg font-semibold text-left"
                  >
                    <div className="flex items-center">
                      <MdSettings className="w-5 h-5 mr-3 text-gray-800" />
                      <span>Paramètres</span>
                    </div>
                    <MdExpandMore
                      className={`transform transition-transform duration-200 ${
                        openSettings ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {openSettings && (
                    <ul className="ml-12 mt-2 space-y-2 text-sm text-gray-700">
                      <li>
                        <Link
                          onClick={() =>
                            menuClick("Profile", "/parametre/profile")
                          }
                          className={`block px-2 py-1 hover:text-blue-600${
                            active === "Profile"
                              ? " text-blue-600"
                              : " text-gray-800"
                          }`}
                        >
                          Profil
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() =>
                            menuClick("Curcus", "/parametre/curcus")
                          }
                          className={`block px-2 py-1 hover:text-blue-600${
                            active === "Curcus"
                              ? " text-blue-600"
                              : " text-gray-800"
                          }`}
                        >
                          Curcus
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;
