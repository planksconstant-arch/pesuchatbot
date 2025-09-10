import React, { useState, useMemo, useRef, useEffect } from 'react';

interface PointOfInterest {
  id: string;
  name: string;
  aliases: string[];
  coords: { x: number; y: number };
  description: string;
}

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POIs: PointOfInterest[] = [
  { id: 'b-block', name: 'B Block (MRD Auditorium)', aliases: ['mrd', 'auditorium', 'main', 'admin'], coords: { x: 44, y: 35 }, description: 'Main administrative and academic building.' },
  { id: 'food-court', name: 'Food Court (OAT)', aliases: ['canteen', 'food', 'oat', 'open air theatre'], coords: { x: 62, y: 46 }, description: 'Main food court, located near the Open Air Theatre.' },
  { id: 'library', name: 'Central Library', aliases: ['books', 'study', 'knowledge center'], coords: { x: 38, y: 55 }, description: 'The university\'s central library and study area.' },
  { id: 'cse-dept', name: 'CSE Department', aliases: ['computer science', 'cs', 'ise'], coords: { x: 44, y: 25 }, description: 'Located on the upper floors of B Block.' },
  { id: 'hostel', name: 'Boys Hostel', aliases: ['bh', 'stay', 'ramaiah'], coords: { x: 78, y: 68 }, description: 'On-campus residence for male students.' },
  { id: 'sports-complex', name: 'Sports Complex', aliases: ['gym', 'basketball', 'cricket', 'ground'], coords: { x: 25, y: 75 }, description: 'Facilities for indoor and outdoor sports.' },
  { id: 'parking', name: 'Multi-level Parking', aliases: ['car', 'bike', 'vehicle'], coords: { x: 70, y: 20 }, description: 'Parking facility for students and staff.' },
];

const PesCampusMap: React.FC<{ pois: PointOfInterest[], activePoiId: string | null, onPoiClick: (poi: PointOfInterest) => void }> = ({ pois, activePoiId, onPoiClick }) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-gray-800 rounded-md">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Base map elements */}
      <path d="M50 50 L750 50 L750 550 L50 550 Z" fill="#1F2937" stroke="#4B5565" strokeWidth="2" />
      <text x="70" y="80" fill="#9CA3AF" fontSize="16">Campus Entrance</text>
      
      {/* Buildings */}
      <rect x="300" y="200" width="150" height="200" fill="#374151" rx="5" />
      <text x="320" y="300" fill="#D1D5DB" className="font-semibold">B Block</text>
      
      <rect x="490" y="250" width="120" height="80" fill="#374151" rx="5" />
      <text x="510" y="295" fill="#D1D5DB" className="font-semibold">Food Court</text>

      <rect x="250" y="380" width="120" height="90" fill="#374151" rx="5" />
      <text x="270" y="425" fill="#D1D5DB" className="font-semibold">Library</text>

      <rect x="100" y="480" width="200" height="100" fill="#374151" rx="5" />
      <text x="130" y="530" fill="#D1D5DB" className="font-semibold">Sports Complex</text>

      <rect x="600" y="100" width="100" height="120" fill="#374151" rx="5" />
      <text x="615" y="160" fill="#D1D5DB" className="font-semibold">Parking</text>

      <rect x="650" y="400" width="130" height="130" fill="#374151" rx="5" />
      <text x="680" y="465" fill="#D1D5DB" className="font-semibold">Hostel</text>

      {/* Pins */}
      {pois.map(poi => {
        const isActive = poi.id === activePoiId;
        return (
          <g key={poi.id} onClick={() => onPoiClick(poi)} className="cursor-pointer group">
            <circle 
              cx={`${poi.coords.x}%`} 
              cy={`${poi.coords.y}%`} 
              r={isActive ? "12" : "8"} 
              fill={isActive ? '#DC2626' : '#9CA3AF'} 
              stroke="#FFF" 
              strokeWidth="2"
              className="transition-all duration-300"
              style={isActive ? { filter: 'url(#glow)' } : {}}
            />
            {isActive && <circle cx={`${poi.coords.x}%`} cy={`${poi.coords.y}%`} r="8" fill="#DC2626" className="animate-pulse" />}
            <text 
              x={`${poi.coords.x}%`} 
              y={`${poi.coords.y - 3}%`}
              fill="#FFF"
              textAnchor="middle"
              className={`text-sm font-bold transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {poi.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const CampusMapModal: React.FC<CampusMapModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [activePoi, setActivePoi] = useState<PointOfInterest | null>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setSearch('');
        setActivePoi(null);
        setTransform({ scale: 1, x: 0, y: 0 });
      }, 300); // Wait for animation to finish
    }
  }, [isOpen]);

  const filteredPois = useMemo(() => {
    if (!search) return [];
    return POIs.filter(poi =>
      poi.name.toLowerCase().includes(search.toLowerCase()) ||
      poi.aliases.some(alias => alias.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);
  
  const handlePoiSelect = (poi: PointOfInterest) => {
    setActivePoi(poi);
    setSearch('');
    // Center and zoom logic can be added here
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    setTransform(t => {
        const newScale = Math.min(Math.max(t.scale + scaleAmount, 0.5), 4);
        return { ...t, scale: newScale };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      `}</style>
      <div className="bg-gray-900 rounded-lg shadow-2xl p-4 w-11/12 h-5/6 max-w-7xl relative animate-slide-up border border-gray-700 flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-500 transition-colors z-20" aria-label="Close">&times;</button>
        
        <div className="flex-shrink-0 p-2 relative">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-red-500">PES University Campus Map</h2>
                <div className="flex gap-2">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=PES+University+Electronic+City+Campus" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-blue-500 transition-colors">Directions to EC Campus</a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=PES+University" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-blue-500 transition-colors">Directions to RR Campus</a>
                </div>
            </div>
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for buildings, labs, canteens..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {search && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-md max-h-48 overflow-y-auto z-10">
                        {filteredPois.length > 0 ? (
                            filteredPois.map(poi => (
                                <div key={poi.id} onClick={() => handlePoiSelect(poi)} className="p-2 hover:bg-red-600/50 cursor-pointer">
                                    {poi.name}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-400">No results found.</div>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div 
          className="flex-grow bg-gray-800/50 rounded-lg mt-2 overflow-hidden cursor-grab active:cursor-grabbing"
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Stop panning if mouse leaves container
          onWheel={handleWheel}
        >
            <div 
              ref={mapContentRef}
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transition: 'transform 0.1s ease-out',
                width: '100%',
                height: '100%'
              }}
            >
              <PesCampusMap pois={POIs} activePoiId={activePoi?.id ?? null} onPoiClick={handlePoiSelect} />
            </div>
        </div>
        {activePoi && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-gray-700 text-white shadow-lg animate-fade-in">
                <h3 className="font-bold text-red-500">{activePoi.name}</h3>
                <p className="text-sm text-gray-300">{activePoi.description}</p>
            </div>
        )}
      </div>
    </div>
  );
};