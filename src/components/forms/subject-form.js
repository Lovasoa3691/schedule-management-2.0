const SubjectForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  mentions,
  niveaux,
  enseignants,
  setShowModal
}) => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Ajouter une nouvelle matiere
        </h2>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-2">
            <label className="">Nom de la matiere</label>
            <input
              type="text"
              name="nomMat"
              placeholder="Nom de la matière"
              value={data.nomMat}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-2">
            <label className="">Nombre d'heures</label>
            <input
              type="number"
              name="nbH"
              placeholder="Nombre d'heures"
              value={data.nbH}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-2">
            <label className="">Coefficient</label>
            <input
              type="number"
              name="coeff"
              placeholder="Coefficient"
              value={data.coeff}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-2">
            <label className="font-semibold">Enseignants :</label>
            <select
              name="enseignantId"
              value={data.enseignantId}
              onChange={handleChange}
              className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="" disabled>
                Choisir un enseignant
              </option>
              {enseignants.length > 0 ? (
                enseignants.map((m, index) => (
                  <option key={index} value={m.id}>
                    {m.nom} {m.prenom}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucun enseignant disponible
                </option>
              )}
            </select>
          </div>

          <div className="flex flex-col mt-6">
            <label className="mb-2">
              Selectionne le mention et niveau cible
            </label>
            <div className="flex gap-4 ">
              <div className="mb-2">
                {/* <label className="font-semibold">
                Selectionner mention et niveau cible
              </label> */}
                <select
                  name="mentionId"
                  multiple
                  value={data.mentionId}
                  onChange={handleChange}
                  className="border p-2 w-64 h-48 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                >
                  {mentions.length > 0 ? (
                    mentions.map((m) => (
                      <option key={m.idMent} value={m.idMent}>
                        {m.nomMention}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucune mention disponible
                    </option>
                  )}
                </select>
              </div>

              <div className="mb-4">
                {/* <label className="font-semibold"></label> */}
                <select
                  name="niveauId"
                  multiple
                  value={data.niveauId}
                  onChange={handleChange}
                  className="border p-2 w-48 h-48 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                >
                  {niveaux.length > 0 ? (
                    niveaux.map((m) => (
                      <option key={m.idNiv} value={m.idNiv}>
                        {m.intitule}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Aucune niveau disponible
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
                onClick={() => setShowModal(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            {!isEdit ? (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Enregistrer
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Mettre a jour
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectForm;
