import { useEffect, useState } from "react";
import { Loader } from "./spin/Spinner";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FiPlus, FiSearch } from "react-icons/fi";
import api from "../hooks/api";
import UserForm from "./forms/user-form";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState([]);
  const [searchfield, setSearchfiled] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userdata, setUserdata] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    api
      .get("/utilisateur/all")
      .then((rep) => {
        setFilter(rep.data);
      })
      .catch(() => {
        setFilter([]);
      });
  });

  return (
    <div className="user-container h-screen">
      <h1 className="text-2xl font-bold mb-4"></h1>
      {/* <p>Cette section est en cours de développement.</p> */}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestion des utilisateurs
        </h2>

        <div className="w-full max-w-md">
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Recherche
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="search"
              value={searchfield}
              onChange={(e) => setSearchfiled(e.target.value)}
              className="w-full border border-gray-300 p-4 ps-10 text-sm text-gray-900 rounded-lg bg-white rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Recherche"
              required
            />
            <button
              type="button"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Aller
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
      >
        <FiPlus className="w-5 h-5" />
        Nouvel utilisateur
      </button>

      {showModal && (
        <UserForm
          data={""}
          setShowModal={setShowModal}
          handleChange={""}
          handleSubmit={""}
          enseignants={""}
        />
      )}

      <div className="shadow rounded-lg mt-6">
        <div className="overflow-x-auto">
          <div className="max-h-[700px] overflow-y-auto">
            <table className="min-w-full bg-white text-gray-700 table-fixed">
              <thead className="bg-indigo-100 text-left font-semibold sticky top-0 z-0">
                <tr>
                  {/* <th className="px-4 py-3 w-16">#</th> */}
                  <th className="px-4 py-3">UTILISATEUR</th>
                  <th className="px-4 py-3">CREATION</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">EMAIL</th>
                  <th className="px-4 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : filter.length > 0 ? (
                  filter.map((u, index) => (
                    <tr
                      key={u.id || index}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      {/* <td className="px-4 py-3 text-sm text-gray-500">
                        {index + 1}
                      </td> */}

                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-14 w-14 flex-shrink-0">
                            <img
                              className="h-14 w-14 rounded-full object-cover border border-gray-200 text-white"
                              src={
                                u.photo ||
                                `https://ui-avatars.com/api/?name=${u.prenom}+${u.nom}&background=random`
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-md font-medium text-gray-900">
                              {u.prenom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {u.role || "Enseignant"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-md italic text-gray-500">
                        {u.creation.slice(0, 8) || "N/A"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.status === "Actif"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {u.status || "En attente"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-md text-blue-600 underline">
                        {u.email || "non-rueigné@mail.com"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button className=" hover:text-blue-900 transition-colors bg-blue-500 p-2 rounded-md text-white">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button className="text-white hover:text-red-900 ml-4 transition-colors p-2 rounded-md bg-red-500">
                          <FaTrashAlt className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center px-6 py-10 text-gray-500 italic"
                    >
                      Aucune donnée trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
