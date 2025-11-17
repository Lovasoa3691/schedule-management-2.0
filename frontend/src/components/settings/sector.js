import { useEffect, useState } from "react";
import CalendrierInteractif from "../customDate/calendar";
import axios from "axios";
import { FaPlus, FaRegCalendarAlt, FaUniversity } from "react-icons/fa";
import { MdOutlineCalendarMonth, MdSchool } from "react-icons/md";

const Sector = () => {
  
  const [mentions, setMentions] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

  const [nomMention, setnomMention] = useState("");
  const [intitule, setIntitule] = useState("");

  const [annee, setAnnee] = useState([]);

  const [anneeData, setAnneeData] = useState({
    idAnnee: 0,
    debut: "",
    fin: "",
    status: "Inactive",
  });

  const loadData = () => {
    axios
      .get("http://localhost:5142/api/mention")
      .then((res) => setMentions(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));

    axios
      .get("http://localhost:5142/api/niveau")
      .then((res) => setNiveaux(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));

    axios
      .get("http://localhost:5142/api/annee")
      .then((res) => setAnnee(res.data))
      .catch((err) => console.error("Erreur de chargement:", err.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMention = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5142/api/mention", { nomMention })
      .then((rep) => {
        loadData();
        setnomMention("");
      });
  };

  const handleSaveNiveau = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5142/api/niveau", { intitule }).then((rep) => {
      loadData();
      setIntitule("");
    });
  };

  const handleChange = (e) => {
    const selectedYear = e.target.value;
    setAnneeData({
      debut: selectedYear,
      fin: selectedYear ? String(Number(selectedYear) + 1) : "",
      status: "Inactive",
    });
  };

  const handleToggle = (id) => {
    const updated = annee.map((a) =>
      a.idAnnee === id ? { ...a, active: true } : { ...a, active: false }
    );
    setAnnee(updated);
  };

  const ajouterAnnee = () => {
    try {
      axios
        .post("http://localhost:5142/api/annee", anneeData)
        .then((rep) => {
          loadData();
          alert("Année scolaire ajoutée avec succès");
        })
        .catch((err) => console.error("Erreur de l'envoie:", err.message));
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'année:", error);
    }
  };

  return (
    <main className=" md:p-10 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Paramètres Généraux
      </h1>

      <p className="text-gray-600 mb-10 max-w-2xl">
        Cette section vous permet de gérer les éléments fondamentaux de votre
        système : les <strong>mentions</strong>, les{" "}
        <strong>niveaux d'études</strong> ainsi que l’
        <strong>année scolaire active</strong>. Assurez-vous que ces
        informations sont correctement configurées pour un bon fonctionnement de
        l’application.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2 mb-2">
            <FaUniversity />
            &nbsp; Mentions/Filieres
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Ajoutez ou modifiez les filières proposées dans votre établissement
            (ex: Informatique, Droit, Gestion...).
          </p>
          <form
            onSubmit={handleSaveMention}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <input
              type="text"
              name="nomMention"
              value={nomMention}
              onChange={(e) => setnomMention(e.target.value)}
              placeholder="Nouvelle mention"
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Ajouter
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-gray-800 border border-gray-200 rounded-lg">
              <thead className="bg-indigo-100 text-left text-sm">
                <tr>
                  <th className="px-4 py-2">Nom du mention</th>

                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {mentions.length > 0 ? (
                  mentions.map((mention) => (
                    <tr key={mention.idMent} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{mention.nomMention}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button className="text-red-600 hover:underline text-sm">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 text-center" colSpan="2">
                      Aucune mention disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2 mb-2">
            <MdSchool />
            &nbsp; Niveaux d'études
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Définissez les niveaux d’études associés à chaque mention (ex: L1
            pour Informatique, L2 pour ICJ, etc).
          </p>

          <form
            onSubmit={handleSaveNiveau}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <input
              type="text"
              name="intitule"
              value={intitule}
              onChange={(e) => setIntitule(e.target.value)}
              placeholder="Nouvelle niveau"
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Ajouter
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-gray-800 border border-gray-200 rounded-lg">
              <thead className="bg-indigo-100 text-left text-sm">
                <tr>
                  <th className="px-4 py-2">Nom du niveau</th>

                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {niveaux.length > 0 ? (
                  niveaux.map((niveau) => (
                    <tr key={niveau.idNiv} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{niveau.intitule}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button className="text-red-600 hover:underline text-sm">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 text-center" colSpan="2">
                      Aucune niveau disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-md transition hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2 flex items-center gap-2">
            <FaRegCalendarAlt />
            &nbsp; Années Scolaires
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Gérez la liste des années scolaires disponibles. Une seule peut être
            active à la fois.
          </p>

          <div className="mb-8">
            <div className="flex gap-3">
              <select
                name="debut"
                value={anneeData.debut}
                onChange={handleChange}
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Debut --</option>
                {Array.from({ length: 50 }, (_, i) => {
                  const year = 2000 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>

              <div className="flex gap-3">
                <select
                  name="fin"
                  value={anneeData.fin}
                  onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">-- Fin --</option>
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = 2000 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={ajouterAnnee}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Ajouter
              </button>
            </div>
          </div>

          <span className="text-gray-600 text-xl">
            Liste des annees scolaires existants
          </span>

          <div className="space-y-4 mt-6">
            {annee.length > 0 ? (
              annee.map((annee) => (
                <div
                  key={annee.idAnnee}
                  className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-800 font-medium">
                    {annee.debut} - {annee.fin}
                  </span>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={annee.status === "Active"}
                      onChange={() => handleToggle(annee.idAnnee)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucune année scolaire disponible</p>
            )}
          </div>
        </section>

        {/* <section className="bg-white p-4 rounded-lg shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2 mb-2">
              <MdOutlineCalendarMonth />
              &nbsp; Calendriers academiques
            </h2>
            <div className="flex gap-2">
              <select className="border px-2 py-1 rounded text-sm">
                <option value="">Filtrer par type</option>
                <option value="cours">Cours</option>
                <option value="vacances">Vacances</option>
                <option value="examen">Examens</option>
              </select>
              <input type="date" className="border px-2 py-1 rounded text-sm" />
            </div>
          </div>

          <div className="h-[400px] bg-gray-100 rounded-lg p-2 text-center text-gray-500">
            <CalendrierInteractif />
          </div>

          <div className="flex justify-end gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
              Exporter PDF
            </button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Exporter Excel
            </button>
          </div>

          <div className="form-group">
            <form className="space-y-3 bg-gray-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-700">
                
                Ajouter un événement
              </h3>

              <input
                type="text"
                placeholder="Nom de l’événement"
                className="w-full border px-3 py-2 rounded"
              />
              <select className="w-full border px-3 py-2 rounded">
                <option>Type d’événement</option>
                <option value="cours">Début des cours</option>
                <option value="examen">Examen</option>
                <option value="vacances">Vacances</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 border px-3 py-2 rounded"
                />
                <input
                  type="date"
                  className="flex-1 border px-3 py-2 rounded"
                />
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Ajouter
              </button>
            </form>
          </div>
        </section> */}
      </div>
    </main>
  );
};

export default Sector;
