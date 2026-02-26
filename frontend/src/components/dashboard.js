import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaDoorOpen, FaCalendarAlt } from "react-icons/fa";
import PieCard from "./chart/pie";
import Select from "react-select";
import { tr } from "date-fns/locale";
import api from "../hooks/api";
import { Loader, Loader2, Spinner } from "./spin/Spinner";

const genderData = [
  { name: "Masculin", value: 60 },
  { name: "Féminin", value: 40 },
];

const COLORS = ["#4F46E5", "#EC4899"];

const Dashboard = () => {
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

  const [selectedMention, setSelectedMention] = useState(null);
  const [selectedNiveau, setSelectedNiveau] = useState(null);
  const [userId, setUserId] = useState(null);

  const [enseignants, setEnseignants] = useState([]);
  const [Man, setMan] = useState([]);
  const [Women, setWomen] = useState([]);

  const [salles, setSalles] = useState([]);

  const [planning, setPlanning] = useState([]);
  const [progressPlan, setProgressPlan] = useState([]);

  const [semestriel, setSemestriel] = useState([]);
  const [partiel, setPartiel] = useState([]);
  const [hebdomadaire, setHebdomadaire] = useState([]);

  const [infoEnseignants, setInfoEnseignants] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/mention").then((rep) => {
      setMentions(rep.data);
    });

    api.get("/niveau").then((rep) => {
      setNiveaux(rep.data);
    });

    api
      .get("/user/profile")
      .then((rep) => {
        setUserId(rep.data.userId);
      })
      .catch((err) => {
        console.error(err.message);
      });

    api
      .get("/user/teacher")
      .then((rep) => {
        setEnseignants(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/edt/all")
      .then((rep) => {
        setPlanning(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/salle")
      .then((rep) => {
        setSalles(rep.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });

    api
      .get("/user/teacher/info/all")
      .then((res) => {
        setInfoEnseignants(res.data);
        setFilter(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
  }, []);

  const formatDate = (date) => {
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear();
    const month = String(dateFormat.getMonth() + 1).padStart(2, "0");
    const day = String(dateFormat.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [filteredProgressPlan, setFilteredProgressPlan] = useState([]);
  const [filteredPlanByDay, setFilteredPlanByDay] = useState([]);

  useEffect(() => {
    const man = enseignants.filter((item) => item.genre === "Masculin");
    setMan(man);

    const fem = enseignants.filter((item) => item.genre === "Féminin");
    setWomen(fem);

    const plan = planning.filter((item) => item.dispo === "En cours");
    setProgressPlan(plan);

    const sem = planning.filter((item) => item.type === "Semestriel");
    setSemestriel(sem);

    const part = planning.filter((item) => item.type === "Partiel");
    setPartiel(part);

    const hebd = planning.filter((item) => item.type === "Hebdomadaire");
    setHebdomadaire(hebd);
  }, [enseignants, planning]);

  useEffect(() => {
    // setLoading(true);
    // setTimeout(() => {
    const filtered = progressPlan.filter(
      (p) => p.jour === formatDate(Date.now()),
    );
    setFilteredProgressPlan(filtered);
    //   setLoading(false);
    // }, 1500);
  }, [progressPlan]);

  const mentionOptions = mentions.map((ment) => ({
    value: ment.nomMention,
    label: ment.nomMention,
  }));

  const niveauOptions = niveaux.map((ment) => ({
    value: ment.intitule,
    label: ment.intitule,
  }));

  const filtrerData = (mention, niveau) => {
    const filtered = filteredProgressPlan.filter(
      (item) =>
        (!mention || item.mention === mention.value) &&
        (!niveau || item.niveau === niveau.value),
    );
    setFilteredProgressPlan(filtered);
  };

  const handleMentionChange = (selectedMention) => {
    setSelectedMention(selectedMention);
    filtrerData(selectedMention, selectedNiveau);
  };

  const handleNiveauChange = (selectedNiveau) => {
    setSelectedNiveau(selectedNiveau);
    filtrerData(selectedMention, selectedNiveau);
  };

  return (
    <div className="dash-container">
      <h2 className="text-2xl text-gray-700">
        Bonjour! Bienvenue sur{" "}
        <span className="font-bold">
          Sched<span className="text-blue-700">Connect</span>
        </span>
      </h2>
      <div className=" h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total enseignants
              </h3>
              {loading ? (
                <Spinner />
              ) : (
                <p className="text-3xl font-bold mt-2">{enseignants?.length}</p>
              )}
            </div>
            <FaChalkboardTeacher className="text-indigo-600 text-4xl" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total salles
              </h3>
              {loading ? (
                <Spinner />
              ) : (
                <p className="text-3xl font-bold mt-2">{salles?.length}</p>
              )}
            </div>
            <FaDoorOpen className="text-green-500 text-4xl" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Plannings en cours
              </h3>
              <div className="text-3xl font-bold mt-2">
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="text-3xl font-bold mt-2">
                    {progressPlan?.length ?? "N/A"}
                  </p>
                )}
              </div>
            </div>
            <FaCalendarAlt className="text-pink-500 text-4xl" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3 mt-6">
        <div className="xl:col-span-2 bg-white shadow rounded-lg p-5 w-full flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Plannings aujourd'hui
            </h2>

            <div className="search-group flex items-center justify-between gap-4">
              <div className="flex items-center ml-auto justify-end gap-2">
                <Select
                  className="w-64"
                  options={mentionOptions}
                  placeholder="Selectionne une mention"
                  value={selectedMention}
                  onChange={handleMentionChange}
                  isClearable
                />
                <Select
                  className="w-64"
                  options={niveauOptions}
                  placeholder="Selectionne un niveau"
                  value={selectedNiveau}
                  onChange={handleNiveauChange}
                  isClearable
                />
              </div>
            </div>
          </div>

          <table className="min-w-full bg-white text-gray-700 table-fixed">
            <thead className="bg-indigo-100 text-left font-semibold sticky top-0 ">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Horaire</th>
                <th className="px-4 py-2">Matière</th>
                <th className="px-4 py-2">Enseignant</th>
                <th className="px-4 py-2">Salle</th>
              </tr>
            </thead>
            <tbody>
              {filteredProgressPlan && filteredProgressPlan.length > 0 ? (
                filteredProgressPlan.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {item.hDeb.slice(0, 5)} - {item.hFin.slice(0, 5)}
                    </td>
                    <td className="px-4 py-2">{item.nomMatiere}</td>
                    <td className="px-4 py-2">{item.prenomEns}</td>
                    <td className="px-4 py-2">{item.nomSalle}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-2 text-gray-500"
                  >
                    Aucune programme trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h3 className="font-semibold text-gray-700 mb-12">
            Diveristé de genre
          </h3>

          <div className="h-40 flex flex-col items-center justify-center text-gray-700">
            <div className="flex items-center justify-between w-full border border-gray-400 rounded-lg p-4 mb-10">
              <span>Homme</span>
              <span>
                {Math.floor((Man?.length * 100) / enseignants?.length) ?? "N/A"}{" "}
                %
              </span>
            </div>
            <div className=" flex items-center justify-between w-full  border border-gray-400 rounded-lg p-4">
              <span>Femme</span>
              <span>
                {Math.floor((Women?.length * 100) / enseignants?.length) ??
                  "N/A"}{" "}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 h-[400px]">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Répartition des planning
          </h2>
          <div className="h-auto text-gray-400">
            {loading ? (
              <>
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
              </>
            ) : hebdomadaire && semestriel && partiel ? (
              <PieCard
                hebdomadaire={hebdomadaire}
                semetriel={semestriel}
                partiel={partiel}
              />
            ) : (
              <p className="text-center text-gray-500">
                Aucune donnée disponible.
              </p>
            )}
            {/* <PieCard
              hebdomadaire={hebdomadaire}
              semetriel={semestriel}
              partiel={partiel}
            /> */}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Suivie des activites des enseignants
            </h2>
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            <table className="min-w-full bg-white text-gray-700 table-fixed">
              <thead className="bg-indigo-100 text-left font-semibold sticky top-0 ">
                <tr>
                  <th className="px-4 py-2">Nom & Prenom</th>
                  {/* <th className="px-4 py-2">Sexe</th> */}
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3}>
                      <Loader2 />
                    </td>
                  </tr>
                ) : infoEnseignants && infoEnseignants.length > 0 ? (
                  infoEnseignants.map((ens, index) => {
                    const totalPrevue = ens.matiereInfo.reduce(
                      (sum, mat) => sum + mat.hPrevue,
                      0,
                    );
                    const totalEffectue = ens.matiereInfo.reduce(
                      (sum, mat) => sum + mat.hEffectue,
                      0,
                    );
                    const performance =
                      totalPrevue > 0
                        ? Math.round((totalEffectue / totalPrevue) * 100)
                        : 0;

                    return (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">
                          {ens.nom} {ens.prenom}
                        </td>
                        <td className="px-4 py-2">{ens.grade}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-row items-center gap-2">
                            <div className="w-full h-2 bg-gray-200 rounded">
                              <div
                                className="h-2 bg-green-500 rounded"
                                style={{ width: `${performance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{performance}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center px-4 py-2 text-gray-500"
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

export default Dashboard;
