import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import SubjectForm from "./forms/subject-form";
import Confirm from "./notification/confirm";
import AlertInfo from "./notification/alert";
import api from "../hooks/api";
import { set } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader } from "./spin/Spinner";
import { can } from "../hooks/permission";
import Swal from "sweetalert2";
import Select from "react-select";

const Subject = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSubject = () => {
    setLoading(true);
    api
      .get("/matiere")
      .then((res) => setMatieres(res.data))
      .catch((err) => {
        console.error("Erreur de chargement:", err);
        Swal.fire({
          title: "Erreur",
          text: "Une erreur est survenue lors du chargement des matières.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1700);
      });
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

  const [searchfield, setSearchfield] = useState("");
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);

  const loadData = () => {
    api.get("/mention").then((res) => setMentions(res.data));
    api.get("/niveau").then((res) => setNiveaux(res.data));
    api.get("/user/teacher").then((res) => {
      setEnseignants(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;

    let finalValue;

    if (multiple) {
      finalValue = Array.from(selectedOptions, (option) =>
        parseInt(option.value),
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
      api.post("/matiere", formData).then((rep) => {
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
        Swal.fire({
          title: "Succès",
          text: "Données enregistrées avec succès.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setShowModal(false);
      });
    } catch (error) {
      console.error("Erreur d'envoie des donnees: ", error.message);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.id) {
      console.error(
        "Identifiant de la matiere est manquante pour la mise à jour",
      );
      return;
    }
    api
      .put(`/matiere/${formData.id}`, formData)
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
    api
      .delete(`/matiere/${deleteId}`)
      .then(() => {
        loadSubject();
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

  const enseignantOptions = enseignants.map((ens) => ({
    value: `${ens.nom} ${ens.prenom}`,
    label: `${ens.nom} ${ens.prenom}`,
  }));

  const filteredMatieres = matieres.filter((mt) => {
    const matchSearch = (
      mt.nomMat +
      " " +
      mt.nbH +
      " " +
      mt.coeff +
      " " +
      mt.mention
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase());

    const matchEnseignant = selectedEnseignant
      ? mt.enseignants?.includes(selectedEnseignant.value)
      : true;

    return matchSearch && matchEnseignant;
  });

  const handleEnseignantChange = (selected) => {
    setSelectedEnseignant(selected);
  };
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
    <div className="subject-container h-screen">
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
          {userRole === "Admin" ? "Gestion des matieres" : "Liste des matieres"}
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
              onChange={(e) => setSearchfield(e.target.value)}
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
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

        <div className="search-group flex items-center justify-between gap-4">
          <Select
            className="w-80"
            options={enseignantOptions}
            placeholder="Filtre par enseignant"
            value={selectedEnseignant}
            onChange={handleEnseignantChange}
            isClearable
          />
        </div>
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
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    MATIERE
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">EC</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    COEFFICIENT
                  </th>

                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    CLASSE
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
                ) : filteredMatieres.length > 0 ? (
                  filteredMatieres.map((mat, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{mat.nomMat}</td>
                      <td className="px-4 py-3">{mat.nbH} Heures</td>
                      <td className="px-4 py-3">{mat.coeff}</td>

                      <td className="px-4 py-3">
                        {mat.mention.join(" / ")} - {mat.niveau.join(" / ")}
                      </td>

                      {can(
                        userRole === "Admin" ? "admin" : "secretary",
                        "edit",
                      ) && (
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
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
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
    </div>
  );
};

export default Subject;
