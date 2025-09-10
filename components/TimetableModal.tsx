import React, { useState, useEffect } from 'react';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schedule = {
  // Monday to Friday
  1: ["Eng. Physics", "Eng. Maths-1", "Python", "Python Lab", "Break", "Mech. Eng.", "Elec. Eng.", "Mentoring"],
  2: ["Eng. Maths-1", "Python", "Eng. Physics", "Mech. Eng.", "Break", "Elec. Eng.", "Env. Studies", "---"],
  3: ["Python", "Eng. Physics", "Elec. Eng.", "Eng. Maths-1", "Break", "Mech. Eng.", "Constitution", "---"],
  4: ["Elec. Eng.", "Mech. Eng.", "Eng. Maths-1", "Eng. Physics Lab", "Break", "Eng. Physics Lab", "Python", "---"],
  5: ["Mech. Eng.", "Elec. Eng.", "Eng. Maths-1", "Python", "Break", "Eng. Physics", "---", "---"],
};

const timeSlots = [
  "8-9 AM", "9-10 AM", "10-11 AM", "11-12 PM",
  "12-1 PM",
  "1-2 PM", "2-3 PM", "3-4 PM"
];

const days = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const TimetableModal: React.FC<TimetableModalProps> = ({ isOpen, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const getCurrentSlot = () => {
    if (!isOpen) return { day: -1, hour: -1 };
    const day = currentTime.getDay(); // Sunday is 0, Monday is 1
    const hour = currentTime.getHours();
    return { day, hour };
  };

  const { day: currentDay, hour: currentHour } = getCurrentSlot();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl p-6 w-11/12 max-w-6xl max-h-[90vh] flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500">Class Timetable (Sample: CSE Sem-1)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>

        <div className="flex-grow overflow-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-800">
                {days.map(day => (
                  <th key={day} className={`p-3 border border-gray-700 ${day === days[currentDay] ? 'text-red-400' : ''}`}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, hourIndex) => {
                 const slotHour = 8 + hourIndex + (hourIndex >= 4 ? 1 : 0);
                 const isCurrentHour = slotHour === currentHour;

                 return (
                    <tr key={time}>
                        <td className={`p-3 border border-gray-700 font-semibold ${isCurrentHour ? 'text-red-400' : ''}`}>{time}</td>
                        {Object.values(schedule).map((daySchedule, dayIndex) => {
                            const isCurrentSlot = (dayIndex + 1 === currentDay) && isCurrentHour;
                            const subject = daySchedule[hourIndex];
                            return (
                                <td key={`${dayIndex}-${hourIndex}`} className={`p-3 border border-gray-700 transition-all duration-300 ${isCurrentSlot ? 'bg-red-600/50 text-white font-bold ring-2 ring-red-500' : ''} ${subject === 'Break' ? 'bg-gray-700/50 text-gray-400 italic' : ''}`}>
                                    {subject}
                                </td>
                            )
                        })}
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
         <p className="text-xs text-gray-500 mt-4 text-center">Disclaimer: This is a sample timetable for demonstration purposes. The current class is highlighted based on your system's time.</p>
      </div>
    </div>
  );
};