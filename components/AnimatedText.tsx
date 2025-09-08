import React from 'react';
import './AnimatedText.css';

interface AnimatedTextProps {
    text: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
    return (
        <span className="animated-text" aria-label={text}>
            {text.split('').map((char, index) => (
                <span 
                    key={index} 
                    style={{ animationDelay: `${index * 0.05}s` }}
                    // Prevent empty space from collapsing
                    className={char === ' ' ? 'whitespace' : ''}
                >
                    {char}
                </span>
            ))}
        </span>
    );
};
