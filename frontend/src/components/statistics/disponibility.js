import { use, useEffect, useState } from "react";
import { MdBarChart, MdExpandMore } from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../hooks/api";
import Swal from "sweetalert2";
import { Loader } from "../spin/Spinner";

const Disponibility = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(false);

  const groupByEnseignant = (data) => {
    const map = {};

    data.forEach((item) => {
      const key = `${item.nomEns}-${item.prenomEns}`;

      if (!map[key]) {
        map[key] = {
          nomEns: item.nomEns,
          prenomEns: item.prenomEns,
          grade: item.grade,
          disponibilites: [],
        };
      }

      if (item.idDispo !== null) {
        map[key].disponibilites.push({
          idDispo: item.idDispo,
          dateDispo: item.dateDispo,
          hDeb: item.hDeb,
          hFin: item.hFin,
        });
      }
    });

    return Object.values(map);
  };

  const getCurrentWeek = (date) => {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const loadDisponibilites = () => {
    const today = new Date();
    const { monday, sunday } = getCurrentWeek(today);
    // console.log("Semaine actuelle:", monday.getDate(), "-", sunday.getDate());
    setLoading(true);
    api
      .get(`/disponibilite/all?week=${monday.getDate()}-${sunday.getDate()}`)
      .then((res) => {
        const grouped = groupByEnseignant(res.data);
        setDisponibilites(grouped);
        // console.log("Disponibilités groupées:", grouped);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Erreur de chargement",
          text: "Impossible de charger les disponibilités. Veuillez réessayer plus tard.",
        });
      })
      .finally(() => setLoading(false));
    // console.error("Erreur de chargement:", err);
  };

  useEffect(() => {
    loadDisponibilites();
  }, []);

  return (
    <div className="dispo-container h-screen">
      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Disposition des enseignants
        </h2>
        <p className="text-sm text-gray-500">
          Analyse hebdomadaire de la répartition des cours sur le mois
          sélectionné
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader size="lg" color="blue" />
        </div>
      ) : (
        <div className="max-h-[800px] overflow-y-auto mt-12 bg-white rounded-lg shadow-md p-8">
          {disponibilites.map((ens, index) => (
            <li className="mb-4 list-none" key={index}>
              <button
                disabled={ens.disponibilites.length === 0}
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-slate-100 rounded-lg font-semibold text-left"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {ens.nomEns.charAt(0).toUpperCase()}
                    {ens.prenomEns.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold text-gray-700">
                      {ens.nomEns.toUpperCase()} {ens.prenomEns}
                    </span>
                    <span className="text-gray-500">{ens.grade}</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="bg-yellow-50 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                    {ens.disponibilites.length === 0
                      ? "Aucune disponibilité"
                      : `${ens.disponibilites.length} disponibilité${
                          ens.disponibilites.length > 1 ? "s" : ""
                        }`}
                  </span>
                  {ens.disponibilites.length > 0 && (
                    <MdExpandMore
                      className={`transform transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="ml-16 mt-3 text-sm text-gray-700">
                  <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-1">
                    <div>Date dispo</div>
                    <div>Heure début</div>
                    <div>Heure fin</div>
                  </div>

                  <div className="mt-2 space-y-2">
                    {ens.disponibilites.length > 0 ? (
                      ens.disponibilites.map((dispo) => (
                        <div
                          key={dispo.idDispo}
                          className="grid grid-cols-3 gap-4 border rounded-lg px-3 py-2 hover:bg-slate-50 transition"
                        >
                          <div>{dispo.dateDispo}</div>
                          <div>{dispo.hDeb}</div>
                          <div>{dispo.hFin}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 italic">
                        Aucune disponibilité enregistrée
                      </div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </div>
      )}
    </div>
  );
};

export default Disponibility;
