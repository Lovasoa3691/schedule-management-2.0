import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import React, { use, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import Select from "react-select";
import axios from "axios";
import { FaFileExcel, FaTimes } from "react-icons/fa";
import PlanningForm from "./forms/planning-form";
import { MdPrint } from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../assets/calendar.css";

import * as XLSX from "xlsx";
const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventsExemple = [
  {
    numEd: "",
    title: "",
    start: new Date(),
    end: new Date(),
    jour: "",
    hDeb: "",
    hFin: "",
    mention: "",
    niveau: "",
    type: "",
    salle: "",
    nomEns: "",
    prenomEns: "",
    status: "",
  },
];

const Planning = () => {
  const [events, setEvents] = useState(eventsExemple);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");
  const [ensignants, setEnsignants] = useState([]);
  const [filteredEns, setFilteredEns] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [filteredMent, setFilteredMent] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [filteredNiv, setFilteredNiv] = useState([]);
  const [salles, setSalles] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [filteredMat, setFilteredMat] = useState([]);
  const [disponibilite, setDisponibilite] = useState([]);
  const [filteredDispo, setFilteredDispo] = useState([]);
  const [formData, setFormData] = useState({
    numEd: "",
    jour: "",
    hDeb: "",
    hFin: "",
    dispo: "En cours",
    type: "",
    responsableId: "59cdd1f1-dc77-4b44-ad30-00add315612c",
    enseignantId: "",
    mentionId: "",
    niveauId: "",
    idSalle: "",
    matiereId: "",
    anneeId: "1",
  });

  const [horaire, setHoaraire] = useState([
    { heure: "07:00" },
    { heure: "07:30" },
    { heure: "08:00" },
    { heure: "08:30" },
    { heure: "09:00" },
    { heure: "09:30" },
    { heure: "10:00" },
    { heure: "10:30" },
    { heure: "11:00" },
    { heure: "11:30" },
    { heure: "12:00" },
    { heure: "12:30" },
    { heure: "13:00" },
    { heure: "13:30" },
    { heure: "14:00" },
    { heure: "14:30" },
    { heure: "15:00" },
    { heure: "15:30" },
    { heure: "16:00" },
    { heure: "16:30" },
    { heure: "17:00" },
    { heure: "17:30" },
    { heure: "18:00" },
  ]);

  const [filteredHoraire, setFilteredHoarire] = useState([]);

  const loadAll = () => {
    axios
      .get("http://localhost:5142/api/utilisateur/teacher")
      .then((res) => {
        setEnsignants(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/mention")
      .then((res) => {
        setMentions(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/niveau")
      .then((res) => {
        setNiveaux(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/salle")
      .then((res) => {
        setSalles(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/matiere")
      .then((res) => {
        setMatieres(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/disponibilite")
      .then((res) => {
        setDisponibilite(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  const loadSchedule = () => {
    axios
      .get("http://localhost:5142/api/edt")
      .then((res) => {
        setEvents(
          res.data.map((event) => ({
            numEd: event.numEd,
            title: event.nomMatiere,
            start: new Date(event.jour + "T" + event.hDeb),
            end: new Date(event.jour + "T" + event.hFin),
            hDeb: event.hDeb,
            hFin: event.hFin,
            mention: event.mention,
            niveau: event.niveau,
            nomEns: event.nomEns,
            prenomEns: event.prenomEns,
            type: event.type,
            salle: event.nomSalle,
            status: event.dispo,
          }))
        );
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadSchedule();
  }, []);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowForm(true);
  };

  useEffect(() => {
    if (selectedDate !== null) {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      setFormData({
        ...formData,
        jour: `${year}-${month}-${day}`,
      });
    }
  }, [selectedDate]);

  const mentionOptions = mentions.map((mnt) => ({
    value: mnt.nomMention,
    label: mnt.nomMention,
  }));

  const niveauOptions = niveaux.map((nv) => ({
    value: nv.intitule,
    label: nv.intitule,
  }));

  const typeOptions = [
    {
      label: "Semestriel",
      value: "Semestriel",
    },
    {
      label: "Partiel",
      value: "Partiel",
    },
    {
      label: "Hebdomadaire",
      value: "Hebdomadaire",
    },
  ];

  const [selectedMention, setSelectedMention] = useState(null);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const filtrerData = (mention, niveau, type) => {
    const filtered = events.filter(
      (item) =>
        (!mention || item.mention === mention.value) &&
        (!niveau || item.niveau === niveau.value) &&
        (!type || item.type === type.value)
    );
    setFilteredEvents(filtered);
  };

  const handleMentionChange = (selectedMention) => {
    setSelectedMention(selectedMention);
    filtrerData(selectedMention, selectedNiveau);
  };

  const handleNiveauChange = (selectedNiveau) => {
    setSelectedNiveau(selectedNiveau);
    filtrerData(selectedMention, selectedNiveau);
  };

  const handleTypeChanged = (selectedType) => {
    setSelectedType(selectedType);
    filtrerData(selectedMention, selectedNiveau, selectedType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      mentionId: parseInt(formData.mentionId),
      niveauId: parseInt(formData.niveauId),
      idSalle: parseInt(formData.idSalle),
      anneeId: parseInt(formData.anneeId),
      jour: formData.jour,
      hDeb: `${formData.hDeb}:00`,
      hFin: `${formData.hFin}:00`,
    };

    axios
      .post("http://localhost:5142/api/edt", data)
      .then((rep) => {
        loadSchedule();
        setFormData({
          numEd: "",
          jour: "",
          hDeb: "",
          hFin: "",
          dispo: "En cours",
          type: "",
          responsableId: localStorage.getItem("user"),
          enseignantId: "",
          mentionId: "",
          niveauId: "",
          idSalle: "",
          matiereId: "",
          anneeId: "1",
        });
        setShowAlert(true);
        setAlert("Données enregistré avec succès!");
      })
      .catch((err) => {
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Erreur serveur:", err.response.data);
        } else {
          console.error("Erreur:", err.message);
        }
      });
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "enseignantId") {
      const selectedEns = ensignants.find(
        (ens) => ens.id.toString() === value.toString()
      );

      if (selectedEns) {
        const dispo = disponibilite.filter((dispo) =>
          selectedEns.nom.includes(dispo.nomEns)
        );
        setFilteredDispo(dispo);

        if (dispo.length > 0) {
          const { hDeb, hFin, dateDispo } = dispo[0];

          if (formatDate(dateDispo) === formatDate(selectedDate)) {
            const toMinutes = (time) => {
              const [hh, mm] = time.split(":").map(Number);
              return hh * 60 + mm;
            };

            const start = toMinutes(hDeb);
            const end = toMinutes(hFin);

            const hours = horaire.filter((h) => {
              const t = toMinutes(h.heure);
              return t >= start && t <= end;
            });

            setFilteredHoarire(hours);
          } else {
            setFilteredHoarire([]);
            console.log("Desole, enseignant non disponible!");
          }
        }
      }

      const ens = ensignants.filter((ens) =>
        ens.id.toString().includes(value.toString())
      );

      setFilteredEns(ens);

      if (ens.length > 0) {
        const mat = matieres.filter((mat) =>
          mat.nomEns.toLowerCase().includes(ens[0].nom.toLowerCase())
        );
        setFilteredMat(mat);
      } else {
        setFilteredMat([]);
      }
    } else if (name === "matiereId") {
      const selectedMat = filteredMat.find(
        (mat) => mat.id.toString() === value.toString()
      );

      if (selectedMat) {
        const ment = mentions.filter((mnt) =>
          selectedMat.mentionId.includes(mnt.idMent)
        );
        setFilteredMent(ment);

        const niv = niveaux.filter((nv) =>
          selectedMat.niveauId.includes(nv.idNiv)
        );
        setFilteredNiv(niv);
      } else {
        setFilteredMent([]);
        setFilteredNiv([]);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // useEffect(() => {
  //   const value = filteredDispo.find(
  //     (dispo) => formatDate(dispo.dateDispo) === formatDate(selectedDate)
  //   );

  //   if (value) {
  //     console.log(value);
  //   }
  //   console.log(value);

  //   console.log("Heure filtrer: ", filteredHoraire);
  // }, [filteredDispo, filteredHoraire]);

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5142/api/utilisateur/teacher/${deleteId}`)
      .then(() => {
        loadSchedule();
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

  const handleExport = () => {
    const doc = new jsPDF();

    const colonnes = ["JOUR", "HORAIRE", "MATIERE", "PROFESSEUR", "SALLE"];

    if (selectedMention && selectedNiveau) {
      const grouped = {};
      events.forEach((e) => {
        const jour = e.start
          .toLocaleDateString("fr-FR", { weekday: "long" })
          .toUpperCase();
        const salle = e.salle;
        const key = `${jour}-${salle}`;

        const horaire = `${e.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${e.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        if (!grouped[key]) {
          grouped[key] = {
            jour,
            salle,
            horaires: [horaire],
            matieres: [e.title],
            profs: [e.prenomEns],
          };
        } else {
          grouped[key].horaires.push(horaire);
          grouped[key].matieres.push(e.title);
          grouped[key].profs.push(e.prenomEns);
        }
      });

      const ligne = Object.values(grouped).map((g) => [
        g.jour,
        g.horaires.join("\n"),
        g.matieres.join("\n"),
        g.profs.join("\n"),
        g.salle,
      ]);

      doc.text(`Emploi du temps`, 15, 10);
      doc.autoTable({
        head: [colonnes],
        body: ligne,
        startY: 20,
        styles: { cellWidth: "wrap" },
        columnStyles: {
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 40 },
        },
      });

      doc.save(`edt_${selectedMention.value}_${selectedNiveau.value}.pdf`);
    }
  };

  return (
    <div>
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Agenda - Planning des cours
          </h2>
          <p className="text-sm text-gray-500">
            Selectionner une date pour ajouter un programme
          </p>
        </div>
        <div className="flex items-center ml-auto justify-end gap-2">
          <Select
            className="w-48 "
            options={typeOptions}
            placeholder="Type"
            value={selectedType}
            onChange={handleTypeChanged}
            isClearable
          />
          <Select
            className="w-48 "
            options={mentionOptions}
            placeholder="Mention"
            value={selectedMention}
            onChange={handleMentionChange}
            isClearable
          />
          <Select
            className="w-48 "
            options={niveauOptions}
            placeholder="Niveau"
            value={selectedNiveau}
            onChange={handleNiveauChange}
            isClearable
          />
          <button
            onClick={handleExport}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
          >
            <MdPrint className="w-5 h-5" />
            <span>Exporter PDF</span>
          </button>
        </div>
      </div>

      <Calendar
        className="bg-white shadow-lg rounded-lg p-6 "
        localizer={localizer}
        culture="fr"
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        onSelectSlot={handleSelectSlot}
        defaultView="month"
        views={["month", "week", "day"]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        components={{
          event: ({ event }) => (
            <div className="p-2 text-sm leading-snug ">
              <div>
                <div className="font-bold">
                  {event.title} | Salle {event.salle}
                </div>
                <div>{event.prenomEns}</div>
                {/* <div className="text-white text-opacity-70">
                  
                </div> */}

                <div
                  className={
                    event.status === "En cours"
                      ? "rounded-full bg-green-400 text-white px-1 py-1 text-xs"
                      : "rounded-full bg-red-600 text-white px-1 py-1 text-xs"
                  }
                >
                  {event.status}
                </div>
              </div>

              <button
                onClick={() => askDelete(event.numEd)}
                className="text-red-500 hover:text-red-700 mt-1 p-4"
                title="Supprimer"
              >
                {/* Annuler */}
                <FaTimes size={20} />
              </button>
            </div>
          ),
        }}
        style={{ height: "90vh" }}
        messages={{
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Événement",
          noEventsInRange: "Aucun événement dans cette période.",
          showMore: (total) => `+ ${total} de plus`,
        }}
      />

      {showForm && selectedDate && (
        <PlanningForm
          enseignants={ensignants}
          mentions={filteredMent}
          niveaux={filteredNiv}
          salles={salles}
          matieres={filteredMat}
          horaires={filteredHoraire}
          selectedDate={selectedDate}
          data={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setShowModal={setShowForm}
        />
      )}
    </div>
  );
};

export default Planning;
