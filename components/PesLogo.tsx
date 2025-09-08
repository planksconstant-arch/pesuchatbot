// Fix: Creating a placeholder logo component.
import React from 'react';

export const PesLogo: React.FC = () => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4H14.5C17.5376 4 20 6.46243 20 9.5C20 12.5376 17.5376 15 14.5 15H8V4Z" fill="currentColor" className="text-red-600"/>
            <path d="M8 15V20H12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"/>
        </svg>
    );
};