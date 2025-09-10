import React from 'react';

interface EmbeddedVideoPlayerProps {
    url: string;
    label?: string;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({ url, label }) => {
    // Convert YouTube shorts URL to embeddable URL
    const embedUrl = url.replace('/shorts/', '/embed/');

    return (
        <div className="w-full">
            <div className="aspect-w-9 aspect-h-16 relative" style={{ paddingBottom: '177.78%' /* 9:16 Aspect Ratio */}}>
                <iframe
                    src={embedUrl}
                    title="Embedded YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-md"
                ></iframe>
            </div>
            {label && <p className="text-center text-xs text-gray-400 mt-2 font-semibold">{label}</p>}
        </div>
    );
};