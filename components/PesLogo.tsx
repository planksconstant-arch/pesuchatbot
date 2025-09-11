import React from 'react';

export const PesLogo: React.FC = () => {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                 <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F87171' }} /> {/* red-400 */}
                    <stop offset="100%" style={{ stopColor: '#B91C1C' }} /> {/* red-800 */}
                </linearGradient>
                <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
            </defs>
            
            <g filter="url(#glow)">
                {/* Main 'B' shape */}
                <path
                    d="M30 15 
                       L30 85 
                       L45 85 
                       C 70 85, 80 75, 80 65 
                       C 80 55, 70 50, 50 50 
                       C 70 50, 75 45, 75 35 
                       C 75 25, 70 15, 45 15 
                       L30 15 Z"
                    fill="url(#logoGradient)"
                />

                {/* 'Eye' in the top part */}
                <ellipse cx="54" cy="35" rx="9" ry="5" fill="url(#eyeGradient)" transform="rotate(10, 54, 35)" />
                
                {/* Prongs on the left */}
                <path d="M22 35 L 30 35 M22 65 L 30 65" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />

                {/* Circuit on the right, from the middle indent */}
                <path d="M50 50 L 60 50 M60 50 L 65 45 M60 50 L 65 55" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
            </g>
        </svg>
    );
};
