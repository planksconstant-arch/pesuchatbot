// Fix: Creating a functional Sidebar component for app navigation.
import React from 'react';

interface SidebarProps {
    onTourClick: () => void;
    onAttendanceClick: () => void;
}

const SidebarButton: React.FC<{ icon: JSX.Element; text: string; onClick?: () => void;}> = ({ icon, text, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-2 rounded-lg text-gray-200 hover:bg-gray-800 transition-colors">
        {icon}
        <span className="ml-3">{text}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ onTourClick, onAttendanceClick }) => {
    return (
        <nav className="flex flex-col bg-[#111111] p-2 space-y-2 w-64 z-20 border-r border-gray-800">
            <SidebarButton icon={<PlusIcon />} text="New Chat" onClick={() => window.location.reload()} />
            <div className="flex-grow" />
            <SidebarButton icon={<CalculatorIcon />} text="Attendance" onClick={onAttendanceClick} />
            <SidebarButton icon={<VideoIcon />} text="Virtual Tour" onClick={onTourClick} />
        </nav>
    );
};

// SVG Icons
const PlusIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
const CalculatorIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3.333M9 17v-3.333M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>
);
const VideoIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);