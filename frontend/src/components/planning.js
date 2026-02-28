import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";
import React, { use, useEffect, useState } from "react";
import Select from "react-select";
import {
  FaCheckCircle,
  FaClock,
  FaFileExcel,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
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
import { can } from "../hooks/permission";
import Swal from "sweetalert2";

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

const eventStyleGetter = (event) => {
  let backgroundColor = "#fb923c";

  if (event.status === "En cours") {
    backgroundColor = "#3b82f6";
  } else if (event.status === "Annulé") {
    backgroundColor = "#dc2626";
  } else {
    backgroundColor = "#10b981";
  }

  return {
    style: {
      backgroundColor,
      borderRadius: "8px",
      color: "white",
      border: "none",
      padding: "2px",
    },
  };
};

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
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    numEd: "",
    jour: "",
    hDeb: "",
    hFin: "",
    dispo: "En cours",
    type: "",
    responsableId: userId,
    enseignantId: "",
    mentionId: "",
    niveauId: "",
    idSalle: "",
    matiereId: "",
    semaine: "",
    anneeId: "1",
  });

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => {
        setUserId(res.data.userId);
      })
      .catch((err) => console.error("Erreur de récupération du profil:", err));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [week, setWeek] = useState(null);

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

  const getCurrentWeek = (date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const today = new Date(selectedDate);
  const { monday, sunday } = getCurrentWeek(today);

  const start = monday.toISOString().split("T")[0];
  const end = sunday.toISOString().split("T")[0];

  const loadAll = () => {
    api
      .get("/user/teacher")
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
  };

  const loadDispo = (selectedDate) => {
    const today = getCurrentWeek(selectedDate);
    const week = `${today.monday.getDate()}-${today.sunday.getDate()}_${today.monday.getMonth() + 1}_${today.monday.getFullYear()}`;
    console.log("Semaine: ", week);

    api
      .get(`/disponibilite/all?week=${week}`)
      .then((res) => {
        if (res.data.length === 0) {
          console.log("Aucune disponibilité trouvée pour la semaine actuelle.");
          return;
        }
        setDisponibilite(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  useEffect(() => {
    if (selectedDate === null) {
      loadDispo(currentDate);
      console.log("Date: ", currentDate);
    } else {
      loadDispo(selectedDate);
      console.log("Date: ", currentDate);
    }
  }, [selectedDate]);

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
      .catch((err) =>
        console.error("Erreur de chargement:", err.response.data),
      );
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
    today.setHours(0, 0, 0, 0);

    const slotDate = new Date(slotInfo.start);
    slotDate.setHours(0, 0, 0, 0);

    setSelectedDate(slotInfo.start);

    if (slotDate < today) {
      Swal.fire({
        title: "Date invalide",
        text: "Impossible de créer un événement à une date déjà passée.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const currentWeekStart = moment(today).startOf("week");
    const slotWeekStart = moment(slotDate).startOf("week");

    if (slotWeekStart.isBefore(currentWeekStart)) {
      Swal.fire({
        title: "Semaine invalide",
        text: "Impossible de créer un événement dans une semaine déjà passée.",
        icon: "error",
        confirmButtonText: "OK",
      });

      return;
    }
    setFormData({
      numEd: "",
      jour: "",
      hDeb: "",
      hFin: "",
      dispo: "En cours",
      type: "",
      responsableId: userId,
      enseignantId: "",
      mentionId: "",
      niveauId: "",
      idSalle: "",
      matiereId: "",
      semaine: "",
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
    const week = `${new Date(monday.toLocaleDateString()).getDate()}-${new Date(sunday.toLocaleDateString()).getDate()}_${new Date(sunday.toLocaleDateString()).getMonth()}_${new Date(sunday.toLocaleDateString()).getFullYear()}`;

    const data = {
      ...formData,
      mentionId: parseInt(formData.mentionId),
      niveauId: parseInt(formData.niveauId),
      idSalle: parseInt(formData.idSalle),
      anneeId: parseInt(formData.anneeId),
      jour: formData.jour,
      hDeb: `${formData.hDeb}:00`,
      hFin: `${formData.hFin}:00`,
      semaine: `${week}`,
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
          responsableId: userId,
          enseignantId: "",
          mentionId: "",
          niveauId: "",
          idSalle: "",
          matiereId: "",
          semaine: "",
          anneeId: "",
        });
        Swal.fire({
          title: "Succès",
          text: "Programme ajouté avec succès!",
          icon: "success",
          confirmButtonText: "OK",
        });
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
        const dispoEns = disponibilite.filter((d) =>
          selectedEns.nom.includes(d.nomEns),
        );

        setFilteredDispo(dispoEns);

        const dispoDuJour = dispoEns.filter(
          (d) => formatDate(d.dateDispo) === formatDate(selectedDate),
        );

        if (dispoDuJour.length === 0) {
          setFilteredHoarire([]);
          setShowForm(false);
          Swal.fire({
            title: "Information",
            text: "Désolé, enseignant non disponible. Veuillez choisir un autre s'il vous plait!",
            icon: "information",
            confirmButtonText: "OK",
          });
          return;
        }

        const toMinutes = (time) => {
          const [hh, mm] = time.split(":").map(Number);
          return hh * 60 + mm;
        };

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

        const uniqueHours = [
          ...new Map(hours.map((h) => [h.heure, h])).values(),
        ];

        setFilteredHoarire(uniqueHours);
        setShowForm(true);
        setshowError(false);
      }

      const ens = ensignants.filter((ens) =>
        ens.id.toString().includes(value.toString()),
      );

      setFilteredEns(ens);

      if (ens.length > 0) {
        const selectedFullName = `${ens[0].nom} ${ens[0].prenom}`
          .toLowerCase()
          .trim();
        const selectedFullNameAlt = `${ens[0].prenom} ${ens[0].nom}`
          .toLowerCase()
          .trim();

        const mat = matieres.filter((mat) => {
          return mat.enseignants.some((e) => {
            const ensNameInMat = e.toLowerCase().trim();
            return (
              ensNameInMat.includes(selectedFullName) ||
              ensNameInMat.includes(selectedFullNameAlt)
            );
          });
        });

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
      .delete(`/user/teacher/${deleteId}`)
      .then(() => {
        loadSchedule();
        Swal.fire({
          title: "Succès",
          text: "Programme supprimé avec succès!",
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

  const handleExport = () => {
    if (!selectedMention || !selectedNiveau) {
      Swal.fire({
        title: "Filtres manquants",
        text: "Veuillez sélectionner une mention et un niveau pour exporter le PDF.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const { monday, sunday } = getCurrentWeek(currentDate);

    const filteredEvents = events.filter((e) => {
      const eventDate = new Date(e.start);
      return (
        e.mention === selectedMention.value &&
        e.niveau === selectedNiveau.value &&
        eventDate >= monday &&
        eventDate <= sunday
      );
    });

    if (filteredEvents.length === 0) {
      Swal.fire({
        title: "Aucun événement",
        text: "Aucun cours trouvé pour les filtres sélectionnés.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const doc = new jsPDF();
    const colonnes = ["JOUR", "HORAIRE", "MATIERE", "PROFESSEUR", "SALLE"];

    const grouped = {};

    filteredEvents.forEach((e) => {
      const jour = e.start
        .toLocaleDateString("fr-FR", { weekday: "long" })
        .toUpperCase();

      const horaire = `${e.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${e.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      const key = `${jour}-${e.salle}`;

      if (!grouped[key]) {
        grouped[key] = {
          jour,
          salle: e.salle,
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

    const lignes = Object.values(grouped).map((g) => [
      g.jour,
      g.horaires.join("\n"),
      g.matieres.join("\n"),
      g.profs.join("\n"),
      g.salle,
    ]);

    doc.text(
      `Emploi du temps - ${selectedMention.label} ${selectedNiveau.label}`,
      15,
      10,
    );

    doc.text(
      `Semaine du ${monday.toLocaleDateString("fr-FR")} au ${sunday.toLocaleDateString("fr-FR")}`,
      15,
      16,
    );

    doc.autoTable({
      head: [colonnes],
      body: lignes,
      startY: 25,
      styles: { cellWidth: "wrap", valign: "middle" },
    });

    doc.save(
      `edt_${selectedMention.value}_${selectedNiveau.value}_${monday.toISOString().slice(0, 10)}.pdf`,
    );
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

  const statusIcon = {
    "En cours": FaClock,
    Annulé: FaTimesCircle,
    Terminé: FaCheckCircle,
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
        <div className="flex items-center ml-auto justify-end gap-2 z-20">
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
            disabled={!selectedMention || !selectedNiveau}
            onClick={handleExport}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
          >
            <MdPrint className="w-5 h-5" />
            <span>Exporter PDF</span>
          </button>
        </div>
      </div>

      <Calendar
        className="bg-white shadow-lg rounded-lg p-6"
        localizer={localizer}
        culture="fr"
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        onSelectSlot={userRole === "Admin" ? null : handleSelectSlot}
        defaultView="month"
        views={["month", "week", "day"]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setModalMode("");
          setShowModal(true);
        }}
        components={{
          event: ({ event }) => {
            const Icon = statusIcon[event.status] || FaCheckCircle;

            return (
              <div className="p-2 text-sm leading-snug">
                <div className="flex items-center gap-1 font-bold">
                  {/* <Icon size={14} /> */}
                  <span>
                    {event.title} | Salle {event.salle}
                  </span>
                </div>

                <div>{event.prenomEns}</div>

                <div className="flex items-center gap-1 text-xs opacity-90 mt-4">
                  <Icon size={16} />
                  <span>{event.status}</span>
                </div>
              </div>
            );
          },
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

      {can(userRole === "Admin" ? "admin" : "secretary", "addPlanning") &&
        showForm &&
        selectedDate && (
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

      {can(userRole === "Admin" ? "admin" : "secretary", "addPlanning") &&
        showModal &&
        selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
              {modalMode === "" && (
                <>
                  <h2 className="text-lg font-bold mb-1">
                    {selectedEvent.title}
                  </h2>

                  <p className="text-sm text-gray-600 mb-4">
                    {selectedEvent.prenomEns} – Salle {selectedEvent.salle}
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Annuler
                    </button>

                    <button
                      onClick={() => setModalMode("edit")}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => setModalMode("confirm")}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}

              {modalMode === "confirm" && (
                <>
                  <h2 className="text-lg font-bold text-red-600 mb-4">
                    Confirmation de suppression
                  </h2>

                  <p className="mb-4">
                    Supprimer la séance du{" "}
                    {selectedEvent.start.toLocaleDateString("fr-FR")} ?
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setModalMode("")}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Retour
                    </button>

                    <button
                      onClick={() => {
                        askDelete(selectedEvent.numEd);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Confirmer
                    </button>
                  </div>
                </>
              )}

              {modalMode === "edit" && (
                <PlanningForm
                  enseignants={ensignants}
                  mentions={filteredMent}
                  niveaux={filteredNiv}
                  salles={salles}
                  matieres={filteredMat}
                  horaires={filteredHoraire}
                  selectedDate={selectedEvent.start}
                  data={{
                    numEd: selectedEvent.numEd,
                    jour: formatDate(selectedEvent.start),
                    hDeb: selectedEvent.hDeb,
                    hFin: selectedEvent.hFin,
                    dispo: selectedEvent.status,
                    type: selectedEvent.type,
                    responsableId: localStorage.getItem("user"),
                    enseignantId:
                      ensignants.find(
                        (ens) =>
                          `${ens.prenom} ${ens.nom}` ===
                          `${selectedEvent.prenomEns} ${selectedEvent.nomEns}`,
                      )?.id || "",
                    mentionId:
                      mentions.find(
                        (mnt) => mnt.nomMention === selectedEvent.mention,
                      )?.idMent || "",
                    niveauId:
                      niveaux.find((nv) => nv.intitule === selectedEvent.niveau)
                        ?.idNiv || "",
                    idSalle:
                      salles.find((s) => s.nomSalle === selectedEvent.salle)
                        ?.idSalle || "",
                    matiereId:
                      matieres.find((m) => m.nomMatiere === selectedEvent.title)
                        ?.id || "",
                    anneeId: "1",
                  }}
                  handleChange={handleChange}
                  handleSubmit={(e) => {
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
                      .put(`/edt/${formData.numEd}`, data)
                      .then(() => {
                        loadSchedule();
                        setShowAlert(true);
                        setAlert("Données modifiées avec succès!");
                      })
                      .catch((err) => {
                        if (err.response) {
                          console.error("Status:", err.response.status);
                          console.error("Erreur serveur:", err.response.data);
                        } else {
                          console.error("Erreur:", err.message);
                        }
                      });
                    setShowModal(false);
                  }}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Planning;
