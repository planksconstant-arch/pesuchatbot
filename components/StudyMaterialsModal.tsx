
import React from 'react';

interface StudyMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const studyMaterialsUrl = "https://8enterprise.vercel.app/other/guides.html";

export const StudyMaterialsModal: React.FC<StudyMaterialsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-lg shadow-2xl p-4 w-11/12 h-5/6 max-w-6xl relative flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500">Study Materials</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        <div className="flex-grow bg-white rounded-md">
          <iframe
            src={studyMaterialsUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            className="rounded-md"
            title="Study Materials"
          >
            Loading...
          </iframe>
        </div>
      </div>
    </div>
  );
};
