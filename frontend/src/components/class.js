import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import axios from "axios"; // assure-toi que axios est installé
import { MdPrint } from "react-icons/md";
import { FaEdit, FaFileExcel, FaTrashAlt } from "react-icons/fa";
import ClassForm from "./forms/class-form";
import AlertInfo from "./notification/alert";
import Confirm from "./notification/confirm";

const ClassRoom = () => {
  const [salles, setSalles] = useState([]);

  const [fileterd, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nomsalle: "",
    typesalle: "",
    capacite: "",
    localisation: "",
  });

  const loadData = () => {
    axios
      .get("http://localhost:8000/api/salle")
      .then((res) => {
        setSalles(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err.message));
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
    axios
      .post("http://localhost:8000/api/salle", formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        setShowAlert(true);
        setAlert("Données enregistré avec succès!");
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
    axios
      .put(`http://localhost:8000/api/salle/${formData.id}`, formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nomsalle: "",
          typesalle: "",
          capacite: "",
          localisation: "",
        });
        setShowAlert(true);
        setAlert("Données modifié avec succès!");
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
    axios
      .delete(`http://localhost:8000/api/salle/${deleteId}`)
      .then(() => {
        loadData();
        setShowAlert(true);
        setAlert("Données supprimées !");
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
      .includes(searchfield.toLowerCase())
  );

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
          Gestion des salles
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

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5 text-white" />
          <span>Nouveau</span>
        </button>
      </div>

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

                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filter.length > 0 ? (
                  filter.map((sl, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{sl.nomsalle}</td>
                      <td className="px-4 py-3">{sl.typesalle}</td>
                      <td className="px-4 py-3">{sl.capacite}</td>
                      <td className="px-4 py-3">{sl.localisation}</td>

                      <td className="px-4 py-3">
                        <button
                          className="text-blue-600 "
                          onClick={() => openModalEdit(sl)}
                        >
                          <FaEdit className="inline-block w-5 h-5" />
                        </button>
                        <button
                          onClick={() => askDelete(sl.idsalle)}
                          className="text-red-600  ml-4"
                        >
                          <FaTrashAlt className="inline-block w-5 h-5" />
                        </button>
                      </td>
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
