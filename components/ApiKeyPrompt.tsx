import React from 'react';

export const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center border border-red-500/50">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h2>
        <p className="text-gray-300">
          The Gemini API key is not configured for this application.
        </p>
        <p className="text-gray-400 mt-2 text-sm">
          Please contact the application administrator to set the required <code>API_KEY</code> environment variable.
        </p>
      </div>
    </div>
  );
};