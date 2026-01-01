const TeacherForm = ({
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
          Ajouter un nouvel élément
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              value={data.nom}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Prenom</label>
            <input
              type="text"
              name="prenom"
              value={data.prenom}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Genre</label>
            <select
              name="genre"
              value={data.genre}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled defaultValue={true}>
                Choisir une genre
              </option>
              <option value="Masculin">Masculin</option>
              <option value="Feminin">Feminin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={data.adresse}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Grade</label>
            <select
              name="grade"
              value={data.grade}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            >
              <option value="" disabled defaultValue={true}>
                Choisir une grade
              </option>
              <option value="Doctorant">Doctorant</option>
              <option value="Professeur Tituliare">Professeur Tituliare</option>
              <option value="Maitres de Conférences">
                Maitres de Conférences
              </option>
              <option value="Assistant">Assistant</option>
              <option value="Vacataire">Vacataire</option>
              <option value="Chargé de cours">Chargé de cours</option>
              <option value="Professeur Associé">Professeur Associé</option>
              <option value="Professeur Émérite">Professeur Émérite</option>
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

export default TeacherForm;
