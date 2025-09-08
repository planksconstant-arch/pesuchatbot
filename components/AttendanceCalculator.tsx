// Fix: Creating a functional component.
import React, { useState, useMemo } from 'react';

interface Subject {
    code: string;
    name: string;
    totalClasses: number | 'NA';
    attendedClasses: number | 'NA';
}

const initialSubjects: Subject[] = [
    { code: 'UE25CS151A', name: 'Python for computational problem solving', totalClasses: 6, attendedClasses: 6 },
    { code: 'UE25CS151A(LAB)', name: 'Python for computational problem solving integrated with lab', totalClasses: 3, attendedClasses: 3 },
    { code: 'UE25EE141A', name: 'Elements of Electrical Engineering', totalClasses: 4, attendedClasses: 4 },
    { code: 'UE25EV121A', name: 'Environmental Studies and Life Sciences', totalClasses: 'NA', attendedClasses: 'NA' },
    { code: 'UE25MA141A', name: 'Engineering Mathematics - I', totalClasses: 7, attendedClasses: 7 },
    { code: 'UE25ME141A', name: 'Mechanical Engineering Sciences', totalClasses: 4, attendedClasses: 4 },
    { code: 'UE25PH151A', name: 'Engineering Physics', totalClasses: 5, attendedClasses: 5 },
    { code: 'UE25PH151A(LAB)', name: 'Engineering Physics integrated with lab', totalClasses: 'NA', attendedClasses: 'NA' },
    { code: 'UL25CE121A', name: 'Constitution of India, Cyber Law and Professional Ethics', totalClasses: 'NA', attendedClasses: 'NA' },
];


export const AttendanceCalculator: React.FC<{isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose }) => {
    const [subjects, setSubjects] = useState(initialSubjects);

    const handleAttendedChange = (code: string, value: string) => {
        setSubjects(subjects.map(s => {
            if (s.code === code && s.totalClasses !== 'NA') {
                if (value === '') {
                    // Allow clearing the input, treat as 0 for calculation.
                    return { ...s, attendedClasses: 0 };
                }
                const attended = parseInt(value, 10);
                // Update only if it's a valid non-negative number.
                if (!isNaN(attended) && attended >= 0) {
                    // Ensure attended classes do not exceed total classes.
                    const newAttended = Math.min(attended, s.totalClasses);
                    return { ...s, attendedClasses: newAttended };
                }
            }
            return s;
        }));
    };

    const calculateNeeded = (total: number, attended: number) => {
        const required = Math.ceil(total * 0.75);
        if (attended >= required) {
            const maxMissable = total - required;
            const currentMissed = total - attended;
            return { needed: 0, canMiss: maxMissable - currentMissed };
        }
        return { needed: required - attended, canMiss: 0 };
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 text-gray-200 rounded-lg shadow-2xl p-6 w-full max-w-4xl relative border border-gray-700" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none font-bold" aria-label="Close">&times;</button>
                <h2 className="text-2xl font-bold mb-4 text-red-500">My Attendance & Calculator (Sem-1)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-3">Course Name</th>
                                <th className="p-3">Total Classes</th>
                                <th className="p-3">Attended</th>
                                <th className="p-3">Percentage</th>
                                <th className="p-3">Status (to maintain 75%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => {
                                const percentage = (subject.totalClasses !== 'NA' && subject.attendedClasses !== 'NA' && subject.totalClasses > 0) 
                                    ? ((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)
                                    : 'N/A';
                                
                                const neededInfo = (subject.totalClasses !== 'NA' && subject.attendedClasses !== 'NA')
                                    ? calculateNeeded(subject.totalClasses, subject.attendedClasses)
                                    : null;
                                
                                const statusColor = parseFloat(percentage) >= 75 ? 'text-green-400' : 'text-red-400';

                                return (
                                <tr key={subject.code} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-3">{subject.name} ({subject.code})</td>
                                    <td className="p-3">{subject.totalClasses}</td>
                                    <td className="p-3">
                                        {subject.totalClasses !== 'NA' ? (
                                             <input
                                                type="number"
                                                value={subject.attendedClasses}
                                                onChange={e => handleAttendedChange(subject.code, e.target.value)}
                                                className="bg-gray-800 w-20 text-center rounded border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                                                min="0"
                                                max={subject.totalClasses}
                                             />
                                        ) : 'N/A'}
                                    </td>
                                    <td className={`p-3 font-semibold ${statusColor}`}>{percentage !== 'N/A' ? `${percentage}%` : 'N/A'}</td>
                                    <td className="p-3">
                                        {neededInfo ? (
                                            neededInfo.needed > 0 
                                                ? <span className="text-red-400">Need to attend {neededInfo.needed} more</span>
                                                : <span className="text-green-400">Can miss {neededInfo.canMiss} more</span>
                                        ) : 'N/A'}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};