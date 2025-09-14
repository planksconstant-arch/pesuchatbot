import React, { useState, useMemo } from 'react';
import { CollegePlacementData, PlacementEntry } from '../placementData';
import { SectorAnalysis } from './SectorAnalysis';

interface PlacementComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CollegePlacementData[];
}

type SortKey = 'company' | 'ctc';
type SortDirection = 'asc' | 'desc';

// Helper to calculate statistics
const calculateStats = (entries: PlacementEntry[]) => {
    const ctcValues = entries.map(e => e.ctc).filter(c => c > 0);
    if (ctcValues.length === 0) {
        return { avgCtc: 0, highestCtc: 0, totalOffers: 0 };
    }
    const totalOffers = entries.reduce((acc, entry) => acc + (entry.offers || 0), 0);
    const avgCtc = ctcValues.reduce((acc, c) => acc + c, 0) / ctcValues.length;
    const highestCtc = Math.max(...ctcValues);
    return {
        avgCtc: parseFloat(avgCtc.toFixed(2)),
        highestCtc: parseFloat(highestCtc.toFixed(2)),
        totalOffers: totalOffers,
    };
};

const CollegeDetailView: React.FC<{ college: CollegePlacementData }> = ({ college }) => {
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'ctc', direction: 'desc' });

    const sortedAndFilteredEntries = useMemo(() => {
        let entries = [...college.entries];

        if (filter) {
            entries = entries.filter(entry =>
                entry.company.toLowerCase().includes(filter.toLowerCase()) ||
                entry.role.toLowerCase().includes(filter.toLowerCase())
            );
        }

        entries.sort((a, b) => {
            if (sortConfig.key === 'company') {
                return sortConfig.direction === 'asc'
                    ? a.company.localeCompare(b.company)
                    : b.company.localeCompare(a.company);
            }
            // Default to sorting by CTC
            return sortConfig.direction === 'asc' ? a.ctc - b.ctc : b.ctc - a.ctc;
        });

        return entries;
    }, [college.entries, filter, sortConfig]);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ for_key: SortKey }> = ({ for_key }) => {
        if (sortConfig.key !== for_key) return <span className="text-gray-500">↕</span>;
        return sortConfig.direction === 'asc' ? <span className="text-white">↑</span> : <span className="text-white">↓</span>;
    };
    
    const stats = calculateStats(college.entries);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center">
                    <div className="text-sm text-gray-400">Total Offers Tracked</div>
                    <div className="text-2xl font-bold text-red-400">{college.summary.totalOffers}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-400">Highest CTC</div>
                    <div className="text-2xl font-bold text-red-400">{stats.highestCtc} LPA</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-400">Average CTC (Top Companies)</div>
                    <div className="text-2xl font-bold text-red-400">{stats.avgCtc} LPA</div>
                </div>
            </div>

            <div className="flex-shrink-0 mb-4 px-1">
                <input
                    type="text"
                    placeholder="Search company or role..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>

            <div className="flex-grow overflow-auto">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-800 sticky top-0">
                        <tr>
                            <th className="p-3 w-2/5 cursor-pointer" onClick={() => handleSort('company')}>
                                Company <SortIcon for_key="company" />
                            </th>
                            <th className="p-3 w-1/5 cursor-pointer" onClick={() => handleSort('ctc')}>
                                CTC (LPA) <SortIcon for_key="ctc" />
                            </th>
                            <th className="p-3 w-2/5">Role</th>
                            <th className="p-3 w-1/6">Offers</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {sortedAndFilteredEntries.map((entry, index) => (
                            <tr key={index} className="hover:bg-gray-800/60">
                                <td className="p-3 font-semibold truncate">{entry.company}</td>
                                <td className="p-3 text-red-400 font-bold">{entry.ctcText}</td>
                                <td className="p-3 text-gray-300 truncate">{entry.role}</td>
                                <td className="p-3">{entry.offers ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ComparisonView: React.FC<{ data: CollegePlacementData[] }> = ({ data }) => {
    const comparisonStats = useMemo(() => {
        return data.map(college => ({
            ...college,
            stats: calculateStats(college.entries),
        })).sort((a,b) => b.stats.highestCtc - a.stats.highestCtc);
    }, [data]);

    return (
        <div className="p-4 h-full">
            <h3 className="text-xl font-bold mb-4 text-center text-white">Placement Highlights Comparison</h3>
            <div className="overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-3">College</th>
                            <th className="p-3 text-center">Total Offers</th>
                            <th className="p-3 text-center">Highest CTC (LPA)</th>
                            <th className="p-3 text-center">Average CTC (Top Companies)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {comparisonStats.map(college => (
                            <tr key={college.id} className="hover:bg-gray-800/60">
                                <td className="p-3 font-semibold text-lg">{college.name} <span className="text-sm text-gray-400">({college.year})</span></td>
                                <td className="p-3 text-center text-xl font-medium">{college.summary.totalOffers}</td>
                                <td className="p-3 text-center text-xl font-bold text-red-400">{college.stats.highestCtc}</td>
                                <td className="p-3 text-center text-xl font-medium">{college.stats.avgCtc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Disclaimer: Data parsed from user-provided text and is for demonstrative purposes. "Total Offers" reflects all tracked offers from the list, while "Average CTC" is calculated from entries with specified compensation.</p>
        </div>
    );
};


export const PlacementComparisonModal: React.FC<PlacementComparisonModalProps> = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState<string>('analysis');

  if (!isOpen) return null;

  const TabButton: React.FC<{ id: string; label: string }> = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
        activeTab === id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const activeCollege = data.find(c => c.id === activeTab);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-lg shadow-2xl p-4 w-11/12 h-5/6 max-w-7xl relative flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h2 className="text-2xl font-bold text-red-500">Placement Comparison</h2>
          <div className="flex flex-wrap gap-2">
             <TabButton id="analysis" label="Sector Analysis" />
             <TabButton id="compare" label="Compare Colleges" />
             {data.map(college => <TabButton key={college.id} id={college.id} label={college.id.startsWith('pes-') ? `PES ${college.year.slice(-2)}` : college.name.split(' ')[0]} />)}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close">&times;</button>
        </div>
        <div className="flex-grow bg-gray-800/30 rounded-md overflow-hidden">
            {activeTab === 'compare' && <ComparisonView data={data} />}
            {activeTab === 'analysis' && <SectorAnalysis data={data} />}
            {activeCollege && <CollegeDetailView college={activeCollege} />}
        </div>
      </div>
    </div>
  );
};