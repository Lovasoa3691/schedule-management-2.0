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
  FaFileExport,
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
import ExportEdtModal from "./export/exportEdt";

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

  useEffect(() => {
    if (mentionOptions.length > 0 && !selectedMention) {
      setSelectedMention(mentionOptions[0]);
    }

    if (niveauOptions.length > 0 && !selectedNiveau) {
      setSelectedNiveau(niveauOptions[0]);
    }
  }, [mentionOptions, niveauOptions]);

  useEffect(() => {
    if (selectedMention && selectedNiveau) {
      filtrerData(selectedMention, selectedNiveau);
    }
  }, [selectedMention, selectedNiveau]);

  const handleMentionChange = (mention) => {
    setSelectedMention(mention ?? mentionOptions[0]);
  };

  const handleNiveauChange = (niveau) => {
    setSelectedNiveau(niveau ?? niveauOptions[0]);
  };

  const handleTypeChanged = (selectedType) => {
    setSelectedType(selectedType);
    filtrerData(selectedMention, selectedNiveau, selectedType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const week = `${new Date(monday.toLocaleDateString()).getDate()}-${new Date(sunday.toLocaleDateString()).getDate()}_${new Date(sunday.toLocaleDateString()).getMonth() + 1}_${new Date(sunday.toLocaleDateString()).getFullYear()}`;

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
        if (err.response?.status === 409) {
          Swal.fire({
            title: "Erreur",
            text: `${err.response.data.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
          // console.error(err.response.data.message);
        }
      });
    setShowForm(false);
  };

  const [showError, setshowError] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [selectedNiveaux, setSelectedNiveaux] = useState([]);

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

  const handleExportMulti = (selectedMentions, selectedNiveaux) => {
    const { monday, sunday } = getCurrentWeek(currentDate);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 10;
    const marginTop = 30;
    const marginBottom = 10;

    const usableWidth = pageWidth - marginX * 2;
    const usableHeight = pageHeight - marginTop - marginBottom;

    const colonnes = ["JOUR", "HORAIRE", "MATIÈRE", "PROF", "SALLE"];

    const getGrid = (count) => {
      if (count <= 3) return { cols: count, rows: 1 };
      if (count === 4) return { cols: 2, rows: 2 };
      if (count <= 6) return { cols: 3, rows: 2 };
      return { cols: 3, rows: 3 };
    };

    selectedNiveaux.forEach((niveau, niveauIndex) => {
      if (niveauIndex > 0) doc.addPage();

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text(`Emploi du temps pour le Niveau ${niveau.label}`, marginX, 12);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Semaine du ${monday.toLocaleDateString("fr-FR")} au ${sunday.toLocaleDateString("fr-FR")}`,
        marginX,
        18,
      );

      const { cols, rows } = getGrid(selectedMentions.length);
      const cellWidth = usableWidth / cols;
      const cellHeight = usableHeight / rows;

      const colWidths = [0.12, 0.18, 0.28, 0.22, 0.2];
      const lineHeight = 8;

      selectedMentions.forEach((mention, index) => {
        const colIndex = index % cols;
        const rowIndex = Math.floor(index / cols);

        const startX = marginX + colIndex * cellWidth;
        const startY = marginTop + rowIndex * cellHeight;

        doc.setFillColor(245, 245, 245);
        doc.rect(startX, startY, cellWidth, cellHeight, "F");

        doc.setFontSize(11);
        doc.setTextColor(0, 51, 102);
        doc.text(mention.label, startX + 2, startY + 6);
        doc.setDrawColor(0, 51, 102);
        doc.line(startX, startY + 7, startX + cellWidth, startY + 7);

        const headerHeight = 10;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 51, 102);
        doc.setFillColor(200, 220, 240);
        doc.rect(startX, startY + 8, cellWidth, headerHeight, "F");

        let colX = startX + 2;
        colonnes.forEach((col, i) => {
          const verticalOffset = headerHeight / 2 + 1;
          doc.text(col, colX, startY + 8 + verticalOffset, {
            maxWidth: cellWidth * colWidths[i] - 2,
          });
          colX += cellWidth * colWidths[i];
        });

        doc.setFont("helvetica", "normal");
        let currentY = startY + 8 + headerHeight + 4;

        const startOfWeek = new Date(monday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(sunday);
        endOfWeek.setHours(23, 59, 59, 999);

        const filteredEvents = events.filter((e) => {
          const d = new Date(e.start);
          return (
            e.mention === mention.value &&
            e.niveau === niveau.value &&
            d >= startOfWeek &&
            d <= endOfWeek
          );
        });

        console.log("Donnee filtres: ", filteredEvents);

        const eventsByDay = {};
        filteredEvents.forEach((e) => {
          const dayKey = new Date(e.start).toISOString().split("T")[0];
          if (!eventsByDay[dayKey]) eventsByDay[dayKey] = [];
          eventsByDay[dayKey].push(e);
        });

        console.log("EventsGrouped: ", eventsByDay);

        let toggle = false;

        if (filteredEvents.length === 0) {
          doc.setTextColor(128, 0, 0);
          doc.text("Aucun cours", startX + cellWidth / 2, currentY + 2, {
            align: "center",
          });
        } else {
          Object.keys(eventsByDay).forEach((dayKey) => {
            const dayEvents = eventsByDay[dayKey];
            let firstLine = true;

            dayEvents.forEach((e) => {
              if (currentY > startY + cellHeight - 2) return;

              if (toggle) doc.setFillColor(230, 240, 250);
              else doc.setFillColor(255, 255, 255);
              doc.rect(startX, currentY - 3, cellWidth, lineHeight, "F");
              toggle = !toggle;

              colX = startX + 2;

              const values = [
                firstLine
                  ? new Date(e.start)
                      .toLocaleDateString("fr-FR", { weekday: "short" })
                      .toUpperCase()
                  : "",
                `${new Date(e.start).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })} - ${new Date(e.end).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}`,
                e.title,
                e.prenomEns,
                e.salle,
              ];

              values.forEach((text, i) => {
                doc.text(
                  doc.splitTextToSize(text, cellWidth * colWidths[i] - 2),
                  colX,
                  currentY,
                );
                colX += cellWidth * colWidths[i];
              });

              firstLine = false;
              currentY += lineHeight;
            });
          });
        }

        doc.setDrawColor(180);
        doc.rect(startX, startY, cellWidth, cellHeight);
      });
    });

    doc.save("edt_grille_mentions.pdf");
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

  const eventsEdts = [
    {
      start: new Date("2026-03-02T09:00:00"),
      end: new Date("2026-03-02T12:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Algorithmique",
      prenomEns: "Rakoto Jean",
      salle: "I101",
    },
    {
      start: new Date("2026-03-02T14:00:00"),
      end: new Date("2026-03-02T17:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "CAE",
      prenomEns: "Rakoto Jean",
      salle: "I101",
    },
    {
      start: new Date("2026-03-02T10:00:00"),
      end: new Date("2026-03-02T12:30:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Probabilité",
      prenomEns: "Rakoto Jean",
      salle: "I101",
    },
    {
      start: new Date("2026-03-03T10:00:00"),
      end: new Date("2026-03-03T12:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Programmation C",
      prenomEns: "Ravelomanana Eric",
      salle: "I102",
    },
    {
      start: new Date("2026-03-04T08:00:00"),
      end: new Date("2026-03-04T10:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Systèmes informatiques",
      prenomEns: "Andrianina Solo",
      salle: "I103",
    },
    {
      start: new Date("2026-03-05T09:00:00"),
      end: new Date("2026-03-05T11:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Mathématiques discrètes",
      prenomEns: "Rasoanaivo Anna",
      salle: "I104",
    },
    {
      start: new Date("2026-03-06T14:00:00"),
      end: new Date("2026-03-06T16:00:00"),
      mention: "INFO",
      niveau: "L1",
      title: "Bureautique",
      prenomEns: "Rakotoarisoa Léa",
      salle: "I105",
    },

    // ===================== BTP L1 =====================
    {
      start: new Date("2026-03-02T08:00:00"),
      end: new Date("2026-03-02T10:00:00"),
      mention: "BTP",
      niveau: "L1",
      title: "Topographie",
      prenomEns: "Razafindrakoto Alain",
      salle: "B201",
    },
    {
      start: new Date("2026-03-03T09:00:00"),
      end: new Date("2026-03-03T11:00:00"),
      mention: "BTP",
      niveau: "L1",
      title: "Matériaux de construction",
      prenomEns: "Rabe Paul",
      salle: "B202",
    },
    {
      start: new Date("2026-03-04T10:00:00"),
      end: new Date("2026-03-04T12:00:00"),
      mention: "BTP",
      niveau: "L1",
      title: "Dessin technique",
      prenomEns: "Randria Marc",
      salle: "B203",
    },
    {
      start: new Date("2026-03-05T08:00:00"),
      end: new Date("2026-03-05T10:00:00"),
      mention: "BTP",
      niveau: "L1",
      title: "Résistance des matériaux",
      prenomEns: "Rajaonarison Luc",
      salle: "B204",
    },
    {
      start: new Date("2026-03-06T13:00:00"),
      end: new Date("2026-03-06T15:00:00"),
      mention: "BTP",
      niveau: "L1",
      title: "Géologie",
      prenomEns: "Rakoto Faly",
      salle: "B205",
    },

    // ===================== GM L1 =====================
    {
      start: new Date("2026-03-02T10:00:00"),
      end: new Date("2026-03-02T12:00:00"),
      mention: "GM",
      niveau: "L1",
      title: "Mécanique générale",
      prenomEns: "Andriamanitra Toky",
      salle: "G301",
    },
    {
      start: new Date("2026-03-03T08:00:00"),
      end: new Date("2026-03-03T10:00:00"),
      mention: "GM",
      niveau: "L1",
      title: "Dessin industriel",
      prenomEns: "Raveloson Hery",
      salle: "G302",
    },
    {
      start: new Date("2026-03-04T09:00:00"),
      end: new Date("2026-03-04T11:00:00"),
      mention: "GM",
      niveau: "L1",
      title: "Science des matériaux",
      prenomEns: "Randriamampionona Joel",
      salle: "G303",
    },
    {
      start: new Date("2026-03-05T14:00:00"),
      end: new Date("2026-03-05T16:00:00"),
      mention: "GM",
      niveau: "L1",
      title: "Thermodynamique",
      prenomEns: "Razanajatovo Eric",
      salle: "G304",
    },
    {
      start: new Date("2026-03-06T08:00:00"),
      end: new Date("2026-03-06T10:00:00"),
      mention: "GM",
      niveau: "L1",
      title: "Mathématiques appliquées",
      prenomEns: "Rasoazanany Clara",
      salle: "G305",
    },

    // ===================== DROIT L1 =====================
    {
      start: new Date("2026-03-02T08:00:00"),
      end: new Date("2026-03-02T10:00:00"),
      mention: "DROIT",
      niveau: "L1",
      title: "Introduction au droit",
      prenomEns: "Rasoanaivo Anna",
      salle: "D401",
    },
    {
      start: new Date("2026-03-03T10:00:00"),
      end: new Date("2026-03-03T12:00:00"),
      mention: "DROIT",
      niveau: "L1",
      title: "Droit constitutionnel",
      prenomEns: "Rakotomalala Jean",
      salle: "D402",
    },
    {
      start: new Date("2026-03-04T14:00:00"),
      end: new Date("2026-03-04T16:00:00"),
      mention: "DROIT",
      niveau: "L1",
      title: "Institutions politiques",
      prenomEns: "Randriatsiferana Mireille",
      salle: "D403",
    },
    {
      start: new Date("2026-03-05T08:00:00"),
      end: new Date("2026-03-05T10:00:00"),
      mention: "DROIT",
      niveau: "L1",
      title: "Histoire du droit",
      prenomEns: "Ravelonarivo Patrick",
      salle: "D404",
    },
    {
      start: new Date("2026-03-06T09:00:00"),
      end: new Date("2026-03-06T11:00:00"),
      mention: "DROIT",
      niveau: "L1",
      title: "Méthodologie juridique",
      prenomEns: "Rakotoarisoa Léa",
      salle: "D405",
    },

    // ===================== ICJ L1 =====================
    {
      start: new Date("2026-03-02T14:00:00"),
      end: new Date("2026-03-02T16:00:00"),
      mention: "ICJ",
      niveau: "L1",
      title: "Introduction à la justice",
      prenomEns: "Razanakoto Fanja",
      salle: "J501",
    },
    {
      start: new Date("2026-03-03T08:00:00"),
      end: new Date("2026-03-03T10:00:00"),
      mention: "ICJ",
      niveau: "L1",
      title: "Organisation judiciaire",
      prenomEns: "Rakotondrabe Joel",
      salle: "J502",
    },
    {
      start: new Date("2026-03-04T10:00:00"),
      end: new Date("2026-03-04T12:00:00"),
      mention: "ICJ",
      niveau: "L1",
      title: "Droit pénal général",
      prenomEns: "Rasoazanany Clara",
      salle: "J503",
    },
    {
      start: new Date("2026-03-05T09:00:00"),
      end: new Date("2026-03-05T11:00:00"),
      mention: "ICJ",
      niveau: "L1",
      title: "Procédure civile",
      prenomEns: "Ravelomanana Eric",
      salle: "J504",
    },
    {
      start: new Date("2026-03-06T13:00:00"),
      end: new Date("2026-03-06T15:00:00"),
      mention: "ICJ",
      niveau: "L1",
      title: "Déontologie juridique",
      prenomEns: "Rakoto Jean",
      salle: "J505",
    },
  ];

  return (
    <div>
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
        <div className="flex items-center ml-auto justify-end gap-2 z-5">
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
            // disabled={!selectedMention || !selectedNiveau}
            onClick={() => setIsExportModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
          >
            <FaFileExport className="w-5 h-5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {isExportModalOpen && (
        <ExportEdtModal
          onClose={() => setIsExportModalOpen(false)}
          mentionOptions={mentionOptions}
          niveauOptions={niveauOptions}
          selectedMentions={selectedMentions}
          setSelectedMentions={setSelectedMentions}
          selectedNiveaux={selectedNiveaux}
          setSelectedNiveaux={setSelectedNiveaux}
          onExport={() => {
            handleExportMulti(selectedMentions, selectedNiveaux);
            setIsExportModalOpen(false);
          }}
        />
      )}

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
