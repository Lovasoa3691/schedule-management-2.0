import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ClassForm from "./forms/class-form";
import AlertInfo from "./notification/alert";
import Confirm from "./notification/confirm";
import api from "../hooks/api";
import { Loader } from "./spin/Spinner";
import { can } from "../hooks/permission";
import Swal from "sweetalert2";

const ClassRoom = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fileterd, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nomsalle: "",
    typesalle: "",
    capacite: "",
    localisation: "",
  });

  const loadData = () => {
    setLoading(true);
    api
      .get("/salle")
      .then((res) => {
        setSalles(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err.message))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1700);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [searchfield, setSearchfiled] = useState("");

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModalEdit = (sl) => {
    setFormData({
      id: sl.idsalle,
      nomsalle: sl.nomsalle,
      typesalle: sl.typesalle,
      capacite: sl.capacite,
      localisation: sl.localisation,
    });
    setShowModalEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/salle", formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Données enregistrées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => console.error("Erreur d'envoi:", err.message));
    setShowModal(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) {
      console.error("ID de l'enseignant manquant pour la mise à jour");
      return;
    }
    api
      .put(`/salle/${formData.id}`, formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Données modifiées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => console.error("Erreur d'envoi:", err.message));
    setShowModalEdit(false);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    api
      .delete(`/salle/${deleteId}`)
      .then(() => {
        loadData();
        Swal.fire({
          title: "Succès",
          text: "Données supprimées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        console.error("Erreur: ", err.message);
      })
      .finally(() => {
        setConfirmDelete(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 1500);
    return () => timer;
  }, [alert]);

  const filter = salles.filter((sl) =>
    (
      sl.nomsalle +
      " " +
      sl.typesalle +
      " " +
      sl.capacite +
      " " +
      sl.localisation
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase()),
  );

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api
      .get("/user/profile")
      .then((rep) => {
        setUserRole(rep.data.userRole);
      })
      .catch(() => {
        setUserRole(null);
      });
  }, []);

  return (
    <div className="classroom-container h-screen">
      {showAlert && alert && (
        <AlertInfo alert={alert} setShowAlert={setShowAlert} />
      )}

      {confirmDelete && (
        <Confirm
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {userRole === "Admin" ? "Gestion des salles" : "Liste des salles"}
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

      {can(userRole === "Admin" ? "admin" : "secretary", "add") && (
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            <FiPlus className="w-5 h-5 text-white" />
            <span>Nouveau</span>
          </button>
        </div>
      )}

      {showModal && (
        <ClassForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <ClassForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={false}
          setShowModal={setShowModalEdit}
        />
      )}

      <div className="shadow rounded-lg mt-6">
        <div className="overflow-x-auto">
          <div className="max-h-[800px] overflow-y-auto">
            <table className="min-w-full bg-white text-gray-700 table-fixed">
              <thead className="bg-indigo-100 text-left font-semibold sticky top-0 z-0">
                <tr>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">#</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">NOM</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">TYPE</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    CAPACITE
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    LOCALISATION
                  </th>

                  {can(
                    userRole === "Admin" ? "admin" : "secretary",
                    "edit",
                  ) && (
                    <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                      ACTIONS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <Loader />
                    </td>
                  </tr>
                ) : filter.length > 0 ? (
                  filter.map((sl, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{sl.nomsalle}</td>
                      <td className="px-4 py-3">{sl.typesalle}</td>
                      <td className="px-4 py-3">{sl.capacite}</td>
                      <td className="px-4 py-3">{sl.localisation}</td>

                      {can(
                        userRole === "Admin" ? "admin" : "secretary",
                        "edit",
                      ) && (
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
                            onClick={() => openModalEdit(sl)}
                          >
                            <FaEdit className="inline-block w-5 h-5" />
                          </button>
                          <button
                            onClick={() => askDelete(sl.idsalle)}
                            className="text-red-600 ml-4 px-2 py-1 rounded hover:bg-red-100 transition"
                          >
                            <FaTrashAlt className="inline-block w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center px-6 py-4 text-gray-500"
                    >
                      Aucun salle trouvé.
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

export default ClassRoom;
