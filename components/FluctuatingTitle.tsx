import React, { useState, useEffect, useRef } from 'react';

const TITLES = [
    "PESpresso",
    "ペスプレッソ", // Japanese
    "ಪೆಸ್ಪ್ರೆಸೊ",   // Kannada
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#';

const FluctuatingTitle: React.FC = () => {
    const [titleIndex, setTitleIndex] = useState(0);
    const [displayText, setDisplayText] = useState(TITLES[0]);
    // Fix: Initialize useRef with null. `useRef<T>()` is invalid; it should be `useRef<T | null>(null)` when no initial value is provided with a generic.
    const frameRequestRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const frameRef = useRef(0);
    const targetTextRef = useRef(TITLES[0]);

    useEffect(() => {
        targetTextRef.current = TITLES[titleIndex];
        frameRef.current = 0; // Reset animation frame for new title
        
        let animationRunning = true;

        const animate = () => {
            if (!animationRunning) return;
            
            const newText = targetTextRef.current.split('').map((char, index) => {
                const progress = frameRef.current / 2; // Speed of character reveal
                if (progress > index) {
                    return targetTextRef.current[index];
                }
                
                if (char === ' ') return ' ';

                const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
                return randomChar;
            }).join('');
            
            setDisplayText(newText);
            
            if (newText === targetTextRef.current) {
                // Animation finished for this word
                timeoutRef.current = window.setTimeout(() => {
                    setTitleIndex(prev => (prev + 1) % TITLES.length);
                }, 3000); // Wait 3 seconds before switching
            } else {
                frameRef.current += 1;
                frameRequestRef.current = requestAnimationFrame(animate);
            }
        };

        animate();
        
        return () => {
            animationRunning = false;
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [titleIndex]);

    return (
        <h1 
            className="text-6xl font-bold text-red-600 pespresso-title mb-2" 
            style={{ fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.01em', minHeight: '80px' }}
            aria-label={TITLES[titleIndex]}
        >
            {displayText}
        </h1>
    );
};

export default FluctuatingTitle;
