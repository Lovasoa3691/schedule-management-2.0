import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import axios from "axios"; // assure-toi que axios est installé
import { MdPrint } from "react-icons/md";
import { FaEdit, FaFileExcel, FaTrashAlt } from "react-icons/fa";
import SubjectForm from "./forms/subject-form";

const Subject = () => {
  const [matieres, setMatieres] = useState([]);

  const loadSubject = () => {
    axios
      .get("http://localhost:5142/api/matiere")
      .then((res) => setMatieres(res.data))
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  useEffect(() => {
    loadSubject();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nomMat: "",
    nbH: 0,
    coeff: 0,
    enseignantId: "",
    mentionId: [],
    niveauId: [],
  });

  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  const loadData = () => {
    axios
      .get("http://localhost:5142/api/mention")
      .then((res) => setMentions(res.data));
    axios
      .get("http://localhost:5142/api/niveau")
      .then((res) => setNiveaux(res.data));
    axios
      .get("http://localhost:5142/api/utilisateur/teacher")
      .then((res) => setEnseignants(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;

    let finalValue;

    if (multiple) {
      finalValue = Array.from(selectedOptions, (option) =>
        parseInt(option.value)
      );
    } else if (name === "nbH" || name === "coeff") {
      finalValue = parseInt(value) || 0;
    } else {
      finalValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5142/api/matiere", formData).then((rep) => {
        loadSubject();
        setFormData({
          id: "",
          nomMat: "",
          nbH: 0,
          coeff: 0,
          enseignantId: "",
          mentionId: [],
          niveauId: [],
        });
        setShowAlert(true);
        setAlert("Données enregistré avec succès!");
      });
    } catch (error) {
      console.error("Erreur d'envoie des donnees: ", error.message);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) {
      console.error(
        "Identifiant de la matiere est manquante pour la mise à jour"
      );
      return;
    }
    axios
      .put(`http://localhost:5142/api/matiere/${formData.id}`, formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nomMat: "",
          nbH: 0,
          coeff: 0,
          enseignantId: "",
          mentionId: [],
          niveauId: [],
        });
        setShowAlert(true);
        setAlert("Données modifié avec succès!");
      })
      .catch((err) => console.error("Erreur d'envoi:", err.message));
    setShowModalEdit(false);
  };

  const openModalEdit = (sub) => {
    setFormData({
      id: sub.id,
      nomMat: sub.nomMat,
      nbH: sub.nbH,
      coeff: sub.coeff,
      enseignantId: sub.id,
      mentionId: sub.mentionId,
      niveauId: sub.niveauId,
    });
    setShowModalEdit(true);
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5142/api/matiere/${deleteId}`)
      .then(() => {
        loadSubject();
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

  const [searchfield, setSearchfield] = useState("");

  const filter = matieres.filter((mt) =>
    (
      mt.nomMat +
      " " +
      mt.nbH +
      " " +
      mt.coeff +
      " " +
      mt.prenomEns +
      " " +
      mt.nomEns +
      " " +
      mt.mention
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase())
  );

  return (
    <div className="subject-container h-screen">
      {showAlert && alert && (
        <div
          id="alert-border-3"
          className="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
          role="alert"
        >
          <svg
            className="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div className="ms-3 text-sm font-medium">{alert}</div>
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-border-3"
            aria-label="Close"
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p className="text-gray-700 mb-6">
              Voulez-vous vraiment supprimer cet élément ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestion des matieres
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
              id="search"
              value={searchfield}
              onChange={(e) => setSearchfield(e.target.value)}
              className="w-full border border-gray-300 p-4 ps-10 text-sm text-gray-900 rounded-lg bg-gray-50 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              // className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        <SubjectForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          mentions={mentions}
          niveaux={niveaux}
          enseignants={enseignants}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <SubjectForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={true}
          mentions={mentions}
          niveaux={niveaux}
          enseignants={enseignants}
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
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    NB HEURES
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    COEFFICIENT
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    ENSEIGNANT
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    MENTION
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    NIVEAU
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filter.length > 0 ? (
                  filter.map((mat, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{mat.nomMat}</td>
                      <td className="px-4 py-3">{mat.nbH}</td>
                      <td className="px-4 py-3">{mat.coeff}</td>
                      <td className="px-4 py-3">
                        {mat.nomEns} {mat.prenomEns}
                      </td>
                      <td className="px-4 py-3">{mat.mention}</td>
                      <td className="px-4 py-3">{mat.niveau.join(" / ")}</td>
                      <td className="px-4 py-3">
                        <button
                          className="text-blue-600 text-sm"
                          onClick={() => openModalEdit(mat)}
                        >
                          <FaEdit className="inline-block w-5 h-5" />
                        </button>
                        <button
                          onClick={() => askDelete(mat.id)}
                          className="text-red-600 text-sm ml-4"
                        >
                          <FaTrashAlt className="inline-block w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center px-6 py-4 text-gray-500"
                    >
                      Aucun matieres trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 text-right">
        <p className="text-gray-600">
          Nombre total de matieres: {matieres.length}
        </p>
      </div>
    </div>
  );
};

export default Subject;
