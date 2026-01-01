const ErrorDialog = ({ error, setshowError }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-[420px] text-center animate-[fadeIn_0.3s_ease-out]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>

        <p className="text-gray-600 mb-6">
          Veuillez choisir un autre enseignant.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setshowError(false)}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:from-green-600 hover:to-green-700 transition"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
