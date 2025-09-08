import React from 'react';

interface VirtualTourModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 rounded-lg shadow-2xl p-4 w-11/12 h-5/6 max-w-6xl relative animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    @keyframes zoom-in {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .animate-zoom-in {
                        animation: zoom-in 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                    }
                `}</style>
                <button 
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-500 transition-colors"
                    aria-label="Close"
                >
                    &times;
                </button>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/lIqo0qbIzLA?autoplay=1&rel=0"
                    title="PES University Campus Tour"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                ></iframe>
            </div>
        </div>
    );
};