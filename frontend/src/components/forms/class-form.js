const ClassForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Ajouter une nouvelle salle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block  font-medium">Nom de la salle</label>
            <input
              type="text"
              name="nomsalle"
              value={data.nomsalle}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block  font-medium">Type de salle</label>
            <select
              name="typesalle"
              value={data.typesalle}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled defaultValue={true}>
                Choisir
              </option>
              <option value="Salle de cours">Salle de cours</option>
              <option value="Amphithéâtre">Amphithéâtre</option>
              <option value="Salle informatique">Salle informatique</option>
              <option value="Laboratoire">Laboratoire</option>
              <option value="Salle de réunion">Salle de réunion</option>
              <option value="Salle de visioconférence">
                Salle de visioconférence
              </option>
            </select>
          </div>

          <div>
            <label className="block  font-medium">Capacite</label>
            <input
              type="text"
              name="capacite"
              value={data.capacite}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block  font-medium">Localisation</label>
            <select
              name="localisation"
              value={data.localisation}
              onChange={handleChange}
              // className="w-full border p-2 rounded"
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled defaultValue={true}>
                Choisir...
              </option>
              <option value="Rée de chaussé">Rée de chaussé</option>
              <option value="Etage 1">Etage 1</option>
              <option value="Etage 2">Etage 2</option>
              <option value="Etage 3">Etage 3</option>
            </select>
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

export default ClassForm;
