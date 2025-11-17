// Toast.jsx
import React from "react";

export const Toast = ({ message, onClose }) => {
  return (
    <div className="bg-white border-l-4 border-blue-500 shadow-md rounded px-4 py-3 mb-2 animate-slide-in-right">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
          &times;
        </button>
      </div>
    </div>
  );
};
