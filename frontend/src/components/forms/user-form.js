const UserForm = ({
  data,
  handleChange,
  handleSubmit,
  isEdit,
  enseignants,
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Ajouter une nouvel utilisateur
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {data && data.role === "Enseignant" ? (
            <div>
              <label className="font-semibold">Enseignant :</label>
              <select
                name="id"
                value={data.id}
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
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium">-- Nom --</label>
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
                <label className="block text-sm font-medium">
                  -- Prénom --
                </label>
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
                <label className="block text-sm font-medium">
                  -- Nom d'utilisateur --
                </label>
                <input
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium">-- Email --</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="font-semibold">-- Role --</label>
            <select
              name="role"
              value={data.role}
              onChange={handleChange}
              className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="" disabled>
                -- Choisir --
              </option>
              <option value="Responsable_planning">Responsable</option>
              <option value="Enseignant">Enseignant</option>
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

export default UserForm;
