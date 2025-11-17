const Confirm = ({ handleDelete, setConfirmDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
        <p className="text-gray-700 mb-6">
          Voulez-vous vraiment supprimer cet élément ?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Oui, supprimer
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
