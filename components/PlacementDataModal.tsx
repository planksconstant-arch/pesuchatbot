
import React, { useState } from 'react';

interface PlacementDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sheets = {
  '2025': "https://docs.google.com/spreadsheets/d/1SnSNM_GnuTwIJ0oI3bHt9nAnDQXfqwIhT8JHEwq727g/preview?rm=minimal",
  '2026': "https://docs.google.com/spreadsheets/d/1TWHZI7pmkmSPa5HXbGXXNqrITgOaB8UaW9kP0bLv_FY/preview?rm=minimal",
};

export const PlacementDataModal: React.FC<PlacementDataModalProps> = ({ isOpen, onClose }) => {
  const [activeYear, setActiveYear] = useState<'2025' | '2026'>('2025');

  if (!isOpen) return null;

  const TabButton: React.FC<{ year: '2025' | '2026' }> = ({ year }) => (
    <button
      onClick={() => setActiveYear(year)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        activeYear === year ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {year} Placements
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-lg shadow-2xl p-4 w-11/12 h-5/6 max-w-6xl relative flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500">Placement Data</h2>
          <div className="flex gap-2">
            <TabButton year="2025" />
            <TabButton year="2026" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        <div className="flex-grow bg-white rounded-md">
          <iframe
            key={activeYear} // Re-mounts iframe on change
            src={sheets[activeYear]}
            width="100%"
            height="100%"
            frameBorder="0"
            className="rounded-md"
            title={`${activeYear} Placement Data`}
          >
            Loading...
          </iframe>
        </div>
      </div>
    </div>
  );
};
