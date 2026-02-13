import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import React, { use, useEffect, useState } from "react";
import Select from "react-select";
import { FaFileExcel, FaTimes } from "react-icons/fa";
import PlanningForm from "./forms/planning-form";
import { MdPrint } from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../assets/calendar.css";

import * as XLSX from "xlsx";
import AlertInfo from "./notification/alert";
import ErrorDialog from "./notification/error";
import Confirm from "./notification/confirm";
import api from "../hooks/api";
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
    responsableId: localStorage.getItem("user"),
    enseignantId: "",
    mentionId: "",
    niveauId: "",
    idSalle: "",
    matiereId: "",
    anneeId: "1",
  });

  function generateHoraire(start = "07:00", end = "18:00", step = 30) {
    const result = [];
    let [hour, minute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      const formatted = `${String(hour).padStart(2, "0")}:${String(
        minute,
      ).padStart(2, "0")}`;
      result.push({ heure: formatted });

      minute += step;
      if (minute >= 60) {
        minute = 0;
        hour++;
      }
    }
    return result;
  }

  const [horaire, setHoraire] = useState(() =>
    generateHoraire("07:00", "18:00", 30),
  );

  const [filteredHoraire, setFilteredHoarire] = useState([]);

  const [alert, setAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadAll = () => {
    api
      .get("/utilisateur/teacher")
      .then((res) => {
        setEnsignants(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    api
      .get("/mention")
      .then((res) => {
        setMentions(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    api
      .get("/niveau")
      .then((res) => {
        setNiveaux(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    api
      .get("/salle")
      .then((res) => {
        setSalles(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    api
      .get("/matiere")
      .then((res) => {
        setMatieres(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    api
      .get("/disponibilite/all")
      .then((res) => {
        setDisponibilite(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  const loadSchedule = () => {
    api
      .get("/edt/all", {
        params: { startDate: null, endDate: null },
      })
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
          })),
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
    const today = new Date();
    setSelectedDate(slotInfo.start);
    const slotDate = new Date(slotInfo.start);

    const currentWeekStart = moment(today).startOf("week");
    const slotWeekStart = moment(slotDate).startOf("week");

    if (slotWeekStart.isBefore(currentWeekStart)) {
      setAlert(
        "Impossible de créer un événement dans une semaine déjà passée.",
      );
      setShowAlert(true);
      return;
    }
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
        (!type || item.type === type.value),
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

    api
      .post("/edt", data)
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

  const [showError, setshowError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "enseignantId") {
      const selectedEns = ensignants.find(
        (ens) => ens.id.toString() === value.toString(),
      );

      if (selectedEns) {
        // 1️⃣ Filtrer les disponibilités par enseignant
        const dispoEns = disponibilite.filter((d) =>
          selectedEns.nom.includes(d.nomEns),
        );

        setFilteredDispo(dispoEns);
        console.log("Dispos enseignant:", dispoEns);

        // 2️⃣ Filtrer les disponibilités pour la date sélectionnée
        const dispoDuJour = dispoEns.filter(
          (d) => formatDate(d.dateDispo) === formatDate(selectedDate),
        );

        // 3️⃣ Si aucune disponibilité ce jour-là
        if (dispoDuJour.length === 0) {
          setFilteredHoarire([]);
          setShowForm(false);
          setshowError(true);
          console.log("Désolé, enseignant non disponible ce jour !");
          return;
        }

        // 4️⃣ Fonction utilitaire : heure -> minutes
        const toMinutes = (time) => {
          const [hh, mm] = time.split(":").map(Number);
          return hh * 60 + mm;
        };

        // 5️⃣ Récupérer tous les créneaux horaires disponibles
        let hours = [];

        dispoDuJour.forEach(({ hDeb, hFin }) => {
          const start = toMinutes(hDeb);
          const end = toMinutes(hFin);

          const h = horaire.filter((ho) => {
            const t = toMinutes(ho.heure);
            return t >= start && t <= end;
          });

          hours = [...hours, ...h];
        });

        // 6️⃣ Supprimer les doublons d'heures
        const uniqueHours = [
          ...new Map(hours.map((h) => [h.heure, h])).values(),
        ];

        // 7️⃣ Mise à jour des états
        setFilteredHoarire(uniqueHours);
        setShowForm(true);
        setshowError(false);
      }

      const ens = ensignants.filter((ens) =>
        ens.id.toString().includes(value.toString()),
      );

      setFilteredEns(ens);

      if (ens.length > 0) {
        const mat = matieres.filter((mat) =>
          mat.nomEns.toLowerCase().includes(ens[0].nom.toLowerCase()),
        );
        setFilteredMat(mat);
      } else {
        setFilteredMat([]);
      }
    } else if (name === "matiereId") {
      const selectedMat = filteredMat.find(
        (mat) => mat.id.toString() === value.toString(),
      );

      if (selectedMat) {
        const ment = mentions.filter((mnt) =>
          selectedMat.mentionId.includes(mnt.idMent),
        );
        setFilteredMent(ment);

        const niv = niveaux.filter((nv) =>
          selectedMat.niveauId.includes(nv.idNiv),
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

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    api
      .delete(`/utilisateur/teacher/${deleteId}`)
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
      if (events.length > 0) {
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
    }
    setShowAlert(true);
    setAlert("Desole! Aucun emploi du temps a exporte pour le moment");
  };

  return (
    <div>
      {showAlert && alert && (
        <AlertInfo alert={alert} setShowAlert={setShowAlert} />
      )}

      {showError && (
        <ErrorDialog
          error={
            "Desole, enseignant non disponible.Veuillez choisir un autre enseignant"
          }
          setshowError={setshowError}
        />
      )}

      {confirmDelete && (
        <Confirm
          handleDelete={handleDelete}
          setConfirmDelete={setConfirmDelete}
        />
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
