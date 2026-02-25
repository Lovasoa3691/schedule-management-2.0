import React, { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { MdPrint } from "react-icons/md";
import {
  FaDownload,
  FaEdit,
  FaFile,
  FaFileCsv,
  FaFileExcel,
  FaFileExport,
  FaFileImport,
  FaFilePdf,
  FaTrashAlt,
  FaUpload,
} from "react-icons/fa";
import TeacherForm from "./forms/teacher-form";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Papa from "papaparse";
import { saveAs } from "file-saver";

import * as XLSX from "xlsx";
import AlertInfo from "./notification/alert";
import Confirm from "./notification/confirm";
import api from "../hooks/api";
import { set } from "date-fns";
import { Loader } from "./spin/Spinner";
import Swal from "sweetalert2";
import { can } from "../hooks/permission";

const Teacher = () => {
  const [enseignant, setEnseignant] = useState([]);
  const [fileterd, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    adresse: "",
    phone: "",
    genre: "",
    grade: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    api
      .get("/utilisateur/teacher")
      .then((res) => {
        setEnseignant(res.data);
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

  const openModalEdit = (ens) => {
    setFormData({
      id: ens.id,
      nom: ens.nom,
      prenom: ens.prenom,
      adresse: ens.adresse,
      phone: ens.phone,
      genre: ens.genre,
      grade: ens.grade,
      email: ens.email,
    });
    setShowModalEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/utilisateur/add/teacher", formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nom: "",
          prenom: "",
          adresse: "",
          phone: "",
          genre: "",
          grade: "",
          email: "",
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
    api
      .put(`/utilisateur/teacher/${formData.id}`, formData)
      .then((res) => {
        loadData();
        setFormData({
          id: "",
          nom: "",
          prenom: "",
          adresse: "",
          phone: "",
          genre: "",
          grade: "",
          email: "",
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
    api
      .delete(`/utilisateur/teacher/${deleteId}`)
      .then(() => {
        loadData();
        setShowAlert(true);
        setAlert("Données supprimées!");
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

  const filter = enseignant.filter((ens) =>
    (
      ens.nom +
      " " +
      ens.prenom +
      " " +
      ens.adresse +
      " " +
      ens.grade +
      " " +
      ens.phone +
      " " +
      ens.genre
    )
      .toLowerCase()
      .includes(searchfield.toLowerCase()),
  );

  const openModal = () => {
    setFormData({
      id: "",
      nom: "",
      prenom: "",
      adresse: "",
      phone: "",
      genre: "",
      grade: "",
      email: "",
    });
    setShowModal(true);
  };

  const ExportExcel = () => {
    if (enseignant.length > 0) {
      const ws = XLSX.utils.json_to_sheet(enseignant);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Enseignant`);
      XLSX.writeFile(wb, "enseignants.xlsx");
    }

    setShowAlert(true);
    setAlert("Desole! Aucun enseignant a exporte pour le moment");
  };

  const ExportPDF = () => {
    const doc = new jsPDF();
    const colonnes = ["NOM", "PRENOM", "GENRE", "GRADE", "TELEPHONE"];
    if (enseignant.length > 0) {
      const ligne = enseignant.map((ligne) => [
        ligne.nom.toUpperCase(),
        ligne.prenom,
        ligne.genre,
        ligne.grade,
        ligne.phone,
      ]);

      doc.text(`Liste des enseignants`, 15, 10);
      doc.autoTable({
        head: [colonnes],
        body: ligne,
        startY: 20,
      });

      doc.save(`liste_enseignants.pdf`);
    }

    setShowAlert(true);
    setAlert("Desole! Aucun enseignant a exporte pour le moment");
  };

  const [anchorElImport, setAnchorElImport] = useState(null);
  const openImportMenu = Boolean(anchorElImport);
  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExportMenu = Boolean(anchorElExport);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleOpenImportMenu = (event) => {
    setAnchorElImport(event.currentTarget);
  };

  const handleOpenExportMenu = (event) => {
    setAnchorElExport(event.currentTarget);
  };

  const handleCloseImportMenu = () => {
    setAnchorElImport(null);
  };

  const handleCloseExportMenu = () => {
    setAnchorElExport(null);
  };

  const downloadCsvTemplate = () => {
    const headers = ["nom", "prenom", "genre", "adresse", "telephone", "grade"];

    const exampleRow = [
      "RAKOTOARIJAONA",
      "Mahafaly Germain",
      "Masculin",
      "Tanambao",
      "0345896612",
      "Professeur Titulaire",
    ];

    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "template_enseignants.csv");
    handleCloseImportMenu();
  };

  const handleImportCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
      encoding: "UTF-8",
      complete: (results) => {
        const data = results.data;
        console.log("Données brutes CSV :", data);

        if (data.length === 0) {
          setImporting(false);
          alert("Le fichier CSV est vide ou mal formaté !");
          return;
        }

        let current = 0;
        setImporting(true);
        setProgress(0);

        const interval = setInterval(() => {
          if (current < 70) {
            current += 5;
            setProgress(current);
          }
        }, 100);

        api
          .post("/utilisateur/teacher/import", data)
          .then(() => {
            clearInterval(interval);

            const finishInterval = setInterval(() => {
              if (current < 100) {
                current += 5;
                setProgress(current);
              } else {
                clearInterval(finishInterval);
                setImporting(false);
                loadData();

                Swal.fire({
                  title: "Importation terminée !",
                  text: "Les données ont été importées avec succès.",
                  icon: "success",
                });
              }
            }, 100);
          })
          .catch((err) => {
            clearInterval(interval);
            setImporting(false);

            console.error("Erreur d'importation:", err?.response?.data);

            Swal.fire({
              title: "Erreur d'importation",
              text: "Une erreur est survenue lors de l'importation des données. Veuillez vérifier le format du fichier.",
              icon: "error",
            });
          });
      },
      error: (err) => {
        console.error("Erreur CSV :", err);
        setImporting(false);
        setProgress(0);
        alert("Erreur lors de l'import CSV");
      },
    });

    handleCloseImportMenu();
    handleCloseExportMenu();
  };

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api
      .get("/utilisateur/profile")
      .then((rep) => {
        setUserRole(rep.data.userRole);
      })
      .catch(() => {
        setUserRole(null);
      });
  }, []);

  return (
    <div className="teacher-container h-screen">
      {showAlert && alert && (
        <AlertInfo alert={alert} setShowAlert={setShowAlert} />
      )}

      <Dialog
        open={importing}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "rounded-xl p-4",
        }}
      >
        <DialogTitle className="text-center font-semibold">
          Importation en cours…
        </DialogTitle>

        <DialogContent className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Veuillez patienter pendant l’analyse du fichier CSV
          </p>

          <LinearProgress
            variant="determinate"
            value={progress}
            className="h-2 rounded-full"
          />

          <p className="text-center text-sm font-medium text-blue-600">
            {progress} %
          </p>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {userRole === "Admin"
            ? "Gestion des enseignants"
            : "Liste des enseignants"}
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={handleOpenExportMenu}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
            >
              <FaFileExport className="w-5 h-5 " />
              Export
            </button>

            <Menu
              anchorEl={anchorElExport}
              open={openExportMenu}
              onClose={handleCloseExportMenu}
              PaperProps={{
                className: "rounded-xl shadow-xl border border-gray-100 mt-2",
              }}
            >
              <MenuItem
                className="flex items-center gap-2 text-sm"
                onClick={ExportPDF}
              >
                <FaFilePdf className="w-5 h-5 text-red-500" />
                PDF
              </MenuItem>
              <MenuItem
                onClick={ExportExcel}
                className="flex items-center gap-2 text-sm"
              >
                <FaFileExcel className="w-5 h-5 text-green-500" />
                Excel
              </MenuItem>
            </Menu>
          </div>
          {can(userRole === "Admin" ? "admin" : "secretary", "import") && (
            <div className="relative">
              <button
                onClick={handleOpenImportMenu}
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-100"
              >
                <FaFileImport className="w-5 h-5" />
                Import
              </button>

              <Menu
                anchorEl={anchorElImport}
                open={openImportMenu}
                onClose={handleCloseImportMenu}
                PaperProps={{
                  className: "rounded-xl shadow-xl border border-gray-100 mt-2",
                }}
              >
                <MenuItem className="text-sm">
                  <label className="flex items-center gap-2 cursor-pointer w-full">
                    <FaUpload className="w-5 h-5 text-blue-400" />
                    Importer CSV
                    <input
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={handleImportCsv}
                    />
                  </label>
                </MenuItem>
                <MenuItem
                  onClick={downloadCsvTemplate}
                  className="flex items-center gap-2 text-sm"
                >
                  <FaDownload className="w-5 h-5" />
                  Télécharger template
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>

        {can(userRole === "Admin" ? "admin" : "secretary", "add") && (
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
          >
            <FiPlus className="w-5 h-5" />
            Nouveau
          </button>
        )}
      </div>

      {showModal && (
        <TeacherForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEdit={false}
          setShowModal={setShowModal}
        />
      )}

      {showModalEdit && (
        <TeacherForm
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          isEdit={true}
          setShowModal={setShowModalEdit}
        />
      )}

      {confirmDelete && (
        <Confirm
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
        />
      )}

      <div className="shadow rounded-lg mt-6">
        <div className="overflow-x-auto">
          <div className="max-h-[700px] overflow-y-auto">
            <table className="min-w-full bg-white text-gray-700 table-fixed">
              <thead className="bg-indigo-100 text-left font-semibold sticky top-0 z-0">
                <tr>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">#</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">NOM</th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    PRENOM
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    GENRE
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    ADRESSE
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    COURRIEL
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    TELEPHONE
                  </th>
                  <th className="px-4 py-3 sticky top-0 bg-indigo-100">
                    GRADE
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
                    <td colSpan={9}>
                      <Loader />
                    </td>
                  </tr>
                ) : filter.length > 0 ? (
                  filter.map((ens, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{ens.nom}</td>
                      <td className="px-4 py-3">{ens.prenom}</td>
                      <td className="px-4 py-3">{ens.genre}</td>
                      <td className="px-4 py-3">{ens.adresse}</td>
                      <td className="px-4 py-3">{ens.email ?? "N/A"}</td>
                      <td className="px-4 py-3">{ens.phone}</td>
                      <td className="px-4 py-3">{ens.grade}</td>
                      {can(
                        userRole === "Admin" ? "admin" : "secretary",
                        "edit",
                      ) && (
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-600 text-md p-2"
                            onClick={() => openModalEdit(ens)}
                          >
                            <FaEdit className="inline-block w-5 h-5" />
                          </button>
                          <button
                            onClick={() => askDelete(ens.id)}
                            className="text-red-600 text-md ml-4 p-2"
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
                      colSpan="9"
                      className="text-center px-6 py-4 text-gray-500"
                    >
                      Aucun enseignant trouvé.
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

export default Teacher;
