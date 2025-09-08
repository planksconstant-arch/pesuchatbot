import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <>
      <style>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #9ca3af; /* gray-400 */
          border-radius: 50%;
          animation: typing-bounce 1.3s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: -0.25s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: -0.5s;
        }
        @keyframes typing-bounce {
          0%, 80%, 100% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="flex items-center space-x-1.5 p-1">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
      </div>
    </>
  );
};