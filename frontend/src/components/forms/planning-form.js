const PlanningForm = ({
  enseignants,
  mentions,
  niveaux,
  salles,
  matieres,
  horaires,
  selectedDate,
  data,
  handleChange,
  handleSubmit,
  setShowModal,
  modalType,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl relative">
        <h2 className="text-lg font-semibold mb-4">
          {modalType === "create"
            ? `Ajouter un événement le ${selectedDate.toLocaleDateString()}`
            : `Modifier l'événement du ${selectedDate.toLocaleDateString()}`}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="text-start">
            <label>Type</label>
            <select
              name="type"
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              value={data.type || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choisir
              </option>
              <option value="Hebdomadaire">Hebdomadaire</option>
              <option value="Semestriel">Semestriel</option>
              <option value="Partiel">Partiel</option>
            </select>
          </div>

          <div className="text-start">
            <label>Enseignant</label>
            <select
              name="enseignantId"
              value={data.enseignantId || ""}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Choisir un enseignant
              </option>
              {enseignants.length > 0 ? (
                enseignants.map((enseignant) => (
                  <option key={enseignant.id} value={enseignant.id}>
                    {enseignant.nom} {enseignant.prenom}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucune enseignant disponible
                </option>
              )}
            </select>
          </div>

          <div className="text-start">
            <label>Matière</label>
            <select
              name="matiereId"
              value={data.matiereId || ""}
              onChange={handleChange}
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Choisir une matière
              </option>

              {matieres.length > 0 ? (
                matieres.map((matiere) => (
                  <option key={matiere.id} value={matiere.id}>
                    {matiere.nomMat}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucune matière disponible
                </option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="text-start">
              <label>Mention</label>
              <select
                name="mentionId"
                value={data.mentionId || ""}
                onChange={handleChange}
                className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Choisir une mention
                </option>
                {mentions.map((mention, index) => (
                  <option key={index} value={mention.idMent}>
                    {mention.nomMention}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-start">
              <label>Niveau</label>
              <select
                name="niveauId"
                value={data.niveauId || ""}
                onChange={handleChange}
                className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Choisir une niveau
                </option>
                {niveaux.map((niveau, index) => (
                  <option key={index} value={niveau.idNiv}>
                    {niveau.intitule}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-start">
            <label>Salle</label>
            <select
              name="idSalle"
              className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              value={data.idSalle || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choisir une salle
              </option>
              {salles.map((salle, index) => (
                <option key={index} value={salle.idsalle}>
                  {salle.nomsalle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="text-start">
              <label htmlFor="">Heure debut</label>
              <select
                name="hDeb"
                className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                value={data.hDeb || ""}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {horaires.map((hour, index) => (
                  <option key={index} value={hour.heure}>
                    {hour.heure}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-start">
              <label htmlFor="">Heure fin</label>
              <select
                name="hFin"
                className="border p-2 w-full mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                value={data.hFin || ""}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {horaires.map((hour, index) => (
                  <option key={index} value={hour.heure}>
                    {hour.heure}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
            >
              {
                modalType === "create" ? "Enregistrer" : "Mettre à jour"
              }
              
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanningForm;
