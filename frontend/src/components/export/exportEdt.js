import React from "react";
import Select from "react-select";

const ExportEdtModal = ({
  onClose,
  mentionOptions,
  niveauOptions,
  selectedMentions,
  setSelectedMentions,
  selectedNiveaux,
  setSelectedNiveaux,
  onExport,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Exporter l’emploi du temps</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mentions</label>
          <Select
            isMulti
            options={mentionOptions}
            value={selectedMentions}
            onChange={(v) => setSelectedMentions(v || [])}
            placeholder="Sélectionner une ou plusieurs mentions"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Niveaux</label>
          <Select
            isMulti
            options={niveauOptions}
            value={selectedNiveaux}
            onChange={(v) => setSelectedNiveaux(v || [])}
            placeholder="Sélectionner un ou plusieurs niveaux"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Annuler
          </button>

          <button
            disabled={
              selectedMentions.length === 0 || selectedNiveaux.length === 0
            }
            onClick={onExport}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            Exporter PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportEdtModal;
