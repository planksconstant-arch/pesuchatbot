import React, { useState, useMemo } from 'react';

interface NearbyHangoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Hangout {
  id: string;
  name: string;
  campus: 'EC' | 'RR';
  type: 'Restaurant' | 'Cafe';
  rating: number;
  description: string;
  gmapsUrl: string;
}

const hangouts: Hangout[] = [
  // EC Restaurants
  { id: 'ahara', name: 'Ahara', campus: 'EC', type: 'Restaurant', rating: 4.7, description: 'North Indian, ideal for a sit-down meal.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ahara+Electronic+City+Bangalore' },
  { id: 'republic-of-noodles', name: 'Republic Of Noodles', campus: 'EC', type: 'Restaurant', rating: 4.6, description: 'Singaporean, Chinese, Malaysian, Desserts.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Republic+Of+Noodles+Lemon+Tree+Hotel+Electronic+City' },
  { id: 'bier-loft', name: 'Bier Loft Brewing Co.', campus: 'EC', type: 'Restaurant', rating: 4.6, description: 'Multi-cuisine with a brew-pub vibe.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bier+Loft+Brewing+Co.+Electronic+City' },
  // EC Cafes
  { id: 'platonic-cafe', name: 'The Platonic Cafe', campus: 'EC', type: 'Cafe', rating: 4.1, description: 'Coffee, burgers, pasta, shakes.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Platonic+Cafe+Electronic+City' },
  { id: 'twilight-cafe', name: 'Twilight Café', campus: 'EC', type: 'Cafe', rating: 4.0, description: 'A cozy café and bakery.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Twilight+Café+Electronic+City' },
  { id: 'chai-days', name: 'Chai Days', campus: 'EC', type: 'Cafe', rating: 3.8, description: 'Variety of teas, coffee and snacks.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chai+Days+Electronic+City' },
  // RR Restaurants
  { id: 'nandhini-deluxe', name: 'Nandhini Deluxe Restaurant', campus: 'RR', type: 'Restaurant', rating: 3.7, description: 'Andhra/Indian cuisine on Ring Road.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nandhini+Deluxe+Restaurant+Banashankari+3rd+Stage' },
  { id: 'jagli-tindi', name: 'Jagli Tindi', campus: 'RR', type: 'Restaurant', rating: 4.0, description: 'Local favorite Indian spot, affordable and popular.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jagli+Tindi+Banashankari' },
  { id: '1947-restaurant', name: '1947 Restaurant', campus: 'RR', type: 'Restaurant', rating: 4.0, description: 'Offers a candle-light dinner ambiance.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=1947+Restaurant+Banashankari+3rd+Stage' },
  // RR Cafes
  { id: 'cafe-jassies', name: "Cafe Jassie's", campus: 'RR', type: 'Cafe', rating: 4.8, description: 'Highest-rated local pick, very close to campus.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cafe+Jassie%27s+Banashankari' },
  { id: 'tea-master', name: 'Tea Master', campus: 'RR', type: 'Cafe', rating: 4.6, description: 'Good choice for tea and quick bites along Outer Ring Road.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tea+Master+Outer+Ring+Road+Banashankari' },
  { id: 'coffee-brewery', name: 'The Coffee Brewery', campus: 'RR', type: 'Cafe', rating: 3.5, description: 'Full café menu with sandwiches and desserts.', gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Coffee+Brewery+30th+Main+Road+Banashankari' },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} filled />)}
            {halfStar && <Star half />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} />)}
            <span className="ml-2 text-sm text-yellow-300 font-semibold">{rating.toFixed(1)}</span>
        </div>
    );
};

const Star: React.FC<{ filled?: boolean; half?: boolean }> = ({ filled, half }) => (
    <svg className={`w-4 h-4 ${filled || half ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d={half ? "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" : "M10 15.27L16.18 19l-1.64-7.03L22 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"} />
    </svg>
);

export const NearbyHangoutsModal: React.FC<NearbyHangoutsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCampus, setSelectedCampus] = useState<'EC' | 'RR'>('EC');
  const [selectedType, setSelectedType] = useState<'Restaurant' | 'Cafe'>('Restaurant');

  const filteredHangouts = useMemo(() => {
    return hangouts.filter(h => h.campus === selectedCampus && h.type === selectedType);
  }, [selectedCampus, selectedType]);

  if (!isOpen) return null;

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        active ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl p-6 w-11/12 max-w-4xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500">Nearby Hangouts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        
        {/* Filters */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 mb-4">
            <div className="p-1 bg-gray-900 border border-gray-700 rounded-lg flex gap-1">
                <TabButton active={selectedCampus === 'EC'} onClick={() => setSelectedCampus('EC')}>EC Campus</TabButton>
                <TabButton active={selectedCampus === 'RR'} onClick={() => setSelectedCampus('RR')}>RR Campus</TabButton>
            </div>
            <div className="p-1 bg-gray-900 border border-gray-700 rounded-lg flex gap-1">
                <TabButton active={selectedType === 'Restaurant'} onClick={() => setSelectedType('Restaurant')}>Restaurants</TabButton>
                <TabButton active={selectedType === 'Cafe'} onClick={() => setSelectedType('Cafe')}>Cafes</TabButton>
            </div>
        </div>

        {/* Results */}
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHangouts.map(hangout => (
                    <div key={hangout.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-gray-100">{hangout.name}</h3>
                            <div className="my-2">
                                <StarRating rating={hangout.rating} />
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{hangout.description}</p>
                        </div>
                        <a 
                            href={hangout.gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full text-center bg-red-600/80 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                        >
                            Get Directions
                        </a>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
