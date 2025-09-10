// Fix: Creating a functional Sidebar component for app navigation.
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
    chatHistory: ChatSession[];
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    activeChatId: string | null;
    onVirtualTourClick: () => void;
    onAttendanceClick: () => void;
    onCampusMapClick: () => void;
    onNearbyHangoutsClick: () => void;
    onTimetableClick: () => void;
    onIntegrationsClick: () => void;
    onPlacementDataClick: () => void;
    onDeleteChat: (chatId: string) => void;
    isHistoryLoading: boolean;
}

const SidebarButton: React.FC<{ icon: JSX.Element; text: string; onClick?: () => void;}> = ({ icon, text, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-2 rounded-lg text-gray-200 hover:bg-white/10 transition-colors">
        {icon}
        <span className="ml-3">{text}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ chatHistory, onSelectChat, onNewChat, activeChatId, onVirtualTourClick, onAttendanceClick, onCampusMapClick, onNearbyHangoutsClick, onTimetableClick, onIntegrationsClick, onPlacementDataClick, onDeleteChat, isHistoryLoading }) => {
    return (
        <nav className="flex flex-col bg-black/30 backdrop-blur-md p-2 space-y-2 w-72 z-20 border-r border-white/10">
            <div className="mb-2">
                <SidebarButton icon={<PlusIcon />} text="New Chat" onClick={onNewChat} />
            </div>
            
            {/* Chat History */}
            <div className="flex-grow overflow-y-auto pr-1">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-2">History</h3>
              <div className="space-y-1">
                {isHistoryLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse"></div>
                    ))
                ) : (
                    chatHistory.map(chat => (
                      <div key={chat.id} className="relative group">
                        <button 
                          onClick={() => onSelectChat(chat.id)}
                          className={`w-full text-left p-2 rounded-lg truncate text-sm transition-colors pr-8 ${activeChatId === chat.id ? 'bg-red-600/50 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                          {chat.title}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 rounded-full hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete chat"
                        >
                            <TrashIcon />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-white/10 pt-2">
                <SidebarButton icon={<PlacementIcon />} text="Placement Data" onClick={onPlacementDataClick} />
                <SidebarButton icon={<TimetableIcon />} text="Timetable" onClick={onTimetableClick} />
                <SidebarButton icon={<VideoIcon />} text="Virtual Tour" onClick={onVirtualTourClick} />
                <SidebarButton icon={<CalculatorIcon />} text="Attendance Calc" onClick={onAttendanceClick} />
                <SidebarButton icon={<MapIcon />} text="Campus Map" onClick={onCampusMapClick} />
                <SidebarButton icon={<FoodIcon />} text="Nearby Hangouts" onClick={onNearbyHangoutsClick} />
                <SidebarButton icon={<IntegrationIcon />} text="Integrations" onClick={onIntegrationsClick} />
            </div>
        </nav>
    );
};

// SVG Icons
const PlacementIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const PlusIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
const TimetableIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const VideoIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55a1 1 0 011.45.89v2.22a1 1 0 01-1.45.89L15 12M5 18V6a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2z" /></svg>
);
const CalculatorIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m-6 4h6m-6 4h.01M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></svg>
);
const MapIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0-6V4a1 1 0 011.447-.894L15 6m-6 11l6-3m-6-3l6-3m0 0V4a1 1 0 011.447-.894L21 6m-6 3l6 3" /></svg>
);
const FoodIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m-8-5h8m-8-5h8M3 21h18M3 12h18M3 3h18" /></svg>
);
const IntegrationIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const TrashIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);