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
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              // value={data.nom}
              // onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Role de l'utilisateur :</label>
            <select
              name="role"
              // value={data.role}
              // onChange={handleChange}
              className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            >
              <option value="" disabled>
                -- Choisir --
              </option>
              <option value="Admin">Admin</option>
              <option value="Responsable_planning">Secrétaire</option>
              <option value="Enseignant">Enseignant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              // value={data.nom}
              // onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div>

          {/* <div >
            <label className="">-- Telephone de l'utilisateur --</label>
            <input
              type="text"
              name="phone"
              placeholder="Telephone de l'utilisateur"
              value={data.phone}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div> */}

          {/* <div >
            <label className="">-- Adresse de l'utilisateur --</label>
            <input
              type="text"
              name="adresse"
              placeholder="Adresse de l'utilisateur"
              value={data.adresse}
              onChange={handleChange}
              className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
          </div> */}

          {/* <div >
            <label className="font-semibold">Enseignant :</label>
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
          </div> */}

          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              // value={data.nom}
              // onChange={handleChange}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
              required
            />
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
