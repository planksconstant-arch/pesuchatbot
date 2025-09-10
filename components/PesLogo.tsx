import React from 'react';

export const PesLogo: React.FC = () => {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DC2626"/>
                    <stop offset="1" stopColor="#7F1D1D"/>
                </linearGradient>
                <clipPath id="p-clip">
                    <path d="M25 10 H 60 C 85 10, 85 30, 60 45 L 60 55 C 85 70, 85 90, 60 90 H 25 V 10 Z" />
                </clipPath>
            </defs>
            
            <path d="M25 10 H 60 C 85 10, 85 30, 60 45 L 60 55 C 85 70, 85 90, 60 90 H 25 V 10 Z" fill="url(#logoGradient)"/>

            <g clipPath="url(#p-clip)" opacity="0.3">
                <path stroke="white" strokeWidth="2" d="M20 20 L 40 20 L 40 40 L 60 40 L 60 60 L 40 60 L 40 80 L 20 80" />
                <path stroke="white" strokeWidth="2" d="M50 15 V 30 H 70 V 50 H 50 V 70 H 70 V 85" />
                <circle cx="40" cy="20" r="3" fill="white" />
                <circle cx="60" cy="40" r="3" fill="white" />
                <circle cx="40" cy="60" r="3" fill="white" />
                <circle cx="40" cy="80" r="3" fill="white" />
                <circle cx="70" cy="30" r="3" fill="white" />
                <circle cx="50" cy="50" r="3" fill="white" />
                <circle cx="70" cy="70" r="3" fill="white" />
            </g>
        </svg>
    );
};