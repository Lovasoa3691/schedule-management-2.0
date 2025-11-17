import { useEffect, useState } from "react";
import Select from "react-select";
import SimpleBarChart from "../chart/bar";
import axios from "axios";

const TeacherHour = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [infoEnseignants, setInfoEnseignants] = useState([]);
  const [filter, setFilter] = useState([]);

  const loadAll = () => {
    axios
      .get("http://localhost:5142/api/utilisateur/teacher/info/all")
      .then((res) => {
        setInfoEnseignants(res.data);
        setFilter(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));

    axios
      .get("http://localhost:5142/api/utilisateur/teacher")
      .then((res) => {
        setEnseignants(res.data);
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const enseignantOptions = enseignants.map((ens) => ({
    value: ens.nom,
    label: `${ens.nom} ${ens.prenom}`,
  }));

  const [selectedEnseignant, setSelectedEnseignant] = useState(null);

  const filtrerData = (selected) => {
    const filtered = infoEnseignants.filter(
      (item) => item.nom === selected.value
    );
    // console.log("Filtrer : ", filtered);
    setFilter(filtered);
  };

  const handleEnseignantChange = (selectedEnseignant) => {
    setSelectedEnseignant(selectedEnseignant);
    filtrerData(selectedEnseignant);

    // console.log("Filtered data: ", filtrerData(selectedEnseignant));
  };

  return (
    <div className="teacher-hour-container h-screen">
      <div className="flex items-center justify-between mb-6 mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Statistiques des heures enseignées
          </h2>
          <p className="text-sm text-gray-500">
            Suivi des heures effectuées par matière et évaluation de
            l'accomplissement des crédits.
          </p>
        </div>

        <div className="search-group flex items-center justify-between gap-4">
          <Select
            className="w-80"
            options={enseignantOptions}
            placeholder="Selectionner un enseignant"
            value={selectedEnseignant}
            onChange={handleEnseignantChange}
            isClearable
          />
        </div>
      </div>

      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
            {filter[0]?.nom.charAt(0) ?? "N/A"} {filter[0]?.prenom.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {filter[0]?.nom ?? "N/A"} {filter[0]?.prenom ?? "N/A"}
            </h3>
            <p className="text-sm text-gray-500">{filter[0]?.grade ?? "N/A"}</p>
            <p className="text-sm text-gray-400">{filter[0]?.email ?? "N/A"}</p>
          </div>
        </div>
        {filter.length > 0 && <SimpleBarChart data={filter} />}
      </div>
    </div>
  );
};

export default TeacherHour;
