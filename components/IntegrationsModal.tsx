import React from 'react';
import { YapLapLogo } from './YapLapLogo';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icons (self-contained for simplicity)
const WebsiteIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" /></svg>;
const CalendarIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TelegramIcon = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.84c-.18.02-.35.06-.52.12l-7.73 3.1c-.5.2-.5.5-.5.5s0 .1.1.1l1.8.6c.1.1.2.2.3.3l.7 2.1c.1.3.3.4.5.2l1.2-.9c.1-.1.2-.1.3 0l2.3 1.7c.4.3.8.1.9-.3l1.3-6.2c.1-.5-.1-.8-.7-.6z"/></svg>;
const DocsIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const YouTubeIcon = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.003c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm-1.603 14.195v-8.39a.5.5 0 01.758-.433l7.243 4.195a.5.5 0 010 .866l-7.243 4.195a.5.5 0 01-.758-.433z" /></svg>;
const BlogIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CSVIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 14h2m-2 3h2m-4-6h.01M15 11h.01" /></svg>;
const MenuIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m-8-5h8m-8-5h8M3 21h18M3 12h18M3 3h18" /></svg>;
const LinkedInIcon = () => <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-11 5H5v10h3V8zm-1.5-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 7.5c0-2.5-1.5-3.5-3-3.5-1.5 0-2.5 1-3 2.5V8H8v10h3v-5c0-1 .5-2 2-2s2 1 2 2v5h3v-5.5z"/></svg>;
const QPIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const integrations = [
  { icon: <WebsiteIcon />, title: 'Official PES Websites', description: 'Daily scraping of pes.edu for new announcements, exam dates, and circulars.', status: 'Automated' },
  { icon: <CalendarIcon />, title: 'Google Calendar Sync', description: 'Syncs official academic calendars for ISAs, ESAs, fests, and workshops.', status: 'Automated' },
  { icon: <TelegramIcon />, title: 'Student Community Groups', description: 'Monitors student-run groups to capture FAQs and summarize discussion highlights.', status: 'Automated' },
  { icon: <DocsIcon />, title: 'Course Documents', description: 'Converts uploaded syllabus PDFs, lab manuals, and notes into a Q&A format.', status: 'Automated' },
  { icon: <YouTubeIcon />, title: 'PES Social Media', description: 'Monitors official YouTube/Instagram for updates on events, lectures, and fests.', status: 'Automated' },
  { icon: <LinkedInIcon />, title: 'Alumni Network Search', description: 'Performs a deep search of the PES alumni network on LinkedIn for career paths.', status: 'Automated' },
  { icon: <QPIcon />, title: 'Question Paper Scraper', description: 'Scrapes Scribd and student sites for previous year question papers and notes.', status: 'Automated' },
  { icon: <BlogIcon />, title: 'Student Blogs (Medium)', description: 'Fetches articles by students/alumni to extract internship and placement tips.', status: 'Automated' },
  { icon: <CSVIcon />, title: 'Placement Data', description: 'Processes placement reports into insights like average packages and top recruiters.', status: 'Automated' },
  { icon: <MenuIcon />, title: 'Cafeteria & Hostel Menus', description: 'Fetches daily menu updates to answer "What’s for lunch today?".', status: 'Planned' },
];

const IntegrationCard: React.FC<{ icon: JSX.Element; title: string; description: string; status: string; align: 'left' | 'right'; }> = ({ icon, title, description, status, align }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-72 relative">
    <div className={`absolute top-1/2 w-16 h-0.5 bg-gray-600/50 ${align === 'left' ? '-right-16' : '-left-16'}`}></div>
    <div className={`absolute top-1/2 -mt-1 w-2 h-2 rounded-full bg-red-500 ${align === 'left' ? 'right-[-2px]' : 'left-[-2px]'}`}>
        <div className="absolute w-full h-full rounded-full bg-red-500 animate-ping opacity-75"></div>
    </div>
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 mr-3 text-red-500 flex-shrink-0">{icon}</div>
      <h3 className="font-bold text-lg text-gray-100 flex-1">{title}</h3>
    </div>
    <p className="text-sm text-gray-400 flex-grow mb-3">{description}</p>
    <div className="mt-auto">
      <span className={`text-xs font-bold py-1 px-2 rounded-full ${status === 'Automated' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
        {status}
      </span>
    </div>
  </div>
);

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sources_left = integrations.slice(0, 5);
  const sources_right = integrations.slice(5);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      `}</style>
      <div 
        className="bg-gray-900/50 backdrop-blur-md rounded-lg shadow-2xl p-6 w-11/12 max-w-7xl max-h-[90vh] flex flex-col border border-gray-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-red-500">PESpresso n8n Workflow</h2>
            <p className="text-sm text-gray-400">The automated knowledge sources powering the AI.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto pr-4 flex items-center justify-center">
            <div className="flex items-center justify-around w-full">
                <div className="flex flex-col gap-8 items-end">
                    {sources_left.map((item, index) => <IntegrationCard key={index} {...item} align="left" />)}
                </div>
                
                <div className="flex-shrink-0 flex flex-col items-center mx-16 text-center">
                    <div className="bg-red-900/50 border-2 border-red-500 rounded-full p-6 shadow-2xl shadow-red-500/30 mb-4">
                        <div className="w-24 h-24 text-white animate-pulse"><YapLapLogo /></div>
                    </div>
                    <h3 className="text-white font-bold text-2xl">PESpresso AI</h3>
                    <p className="text-gray-400 text-sm">Central Knowledge Base</p>
                </div>
                
                <div className="flex flex-col gap-8 items-start">
                    {sources_right.map((item, index) => <IntegrationCard key={index} {...item} align="right" />)}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};