import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fr } from "date-fns/locale";

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

const eventsSample = [
  {
    title: "Début des cours",
    start: new Date(2025, 9, 1), // 1 Oct 2025 (mois 0-indexé)
    end: new Date(2025, 9, 1),
  },
  {
    title: "Examens S1",
    start: new Date(2025, 1, 1),
    end: new Date(2025, 1, 15),
  },
  {
    title: "Vacances d’hiver",
    start: new Date(2025, 1, 16),
    end: new Date(2025, 2, 1),
  },
];

export default function CalendrierInteractif() {
  const [events, setEvents] = useState(eventsSample);

  return (
    <div className="h-[400px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        culture="fr"
        views={["month", "week", "day"]}
        defaultView="month"
      />
    </div>
  );
}
