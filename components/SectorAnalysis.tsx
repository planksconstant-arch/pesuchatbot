import React, { useMemo } from 'react';
import { CollegePlacementData } from '../placementData';

interface SectorAnalysisProps {
    data: CollegePlacementData[];
}

interface SectorStat {
    name: string;
    count: number;
    percentage: number;
}

interface CollegeSectorStats {
    collegeName: string;
    totalTrackedOffers: number;
    sectors: SectorStat[];
}

export const SectorAnalysis: React.FC<SectorAnalysisProps> = ({ data }) => {
    const analysisData = useMemo<CollegeSectorStats[]>(() => {
        return data.map(college => {
            const sectorCounts: Record<string, number> = {};
            let totalTrackedOffers = 0;

            college.entries.forEach(entry => {
                const offerCount = entry.offers || 1; // Assume at least 1 offer if not specified
                sectorCounts[entry.category] = (sectorCounts[entry.category] || 0) + offerCount;
                totalTrackedOffers += offerCount;
            });

            const sectors: SectorStat[] = Object.entries(sectorCounts)
                .map(([name, count]) => ({
                    name,
                    count,
                    percentage: totalTrackedOffers > 0 ? (count / totalTrackedOffers) * 100 : 0,
                }))
                .sort((a, b) => b.count - a.count);

            return {
                collegeName: college.name,
                totalTrackedOffers,
                sectors,
            };
        });
    }, [data]);

    return (
        <div className="p-4 h-full overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-center text-white">Placement Sector Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                {analysisData.map(college => (
                    <div key={college.collegeName} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-lg text-red-400 mb-1">{college.collegeName}</h4>
                        <p className="text-xs text-gray-400 mb-4">Based on {college.totalTrackedOffers} tracked offers from top companies.</p>
                        <div className="space-y-3">
                            {college.sectors.map(sector => (
                                <div key={sector.name}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="font-semibold text-gray-200">{sector.name}</span>
                                        <span className="text-gray-400">{sector.percentage.toFixed(1)}% ({sector.count})</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div 
                                            className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full" 
                                            style={{ width: `${sector.percentage}%` }}
                                            title={`${sector.percentage.toFixed(1)}%`}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <p className="text-xs text-gray-500 mt-6 text-center">Disclaimer: This analysis is based on the available high-CTC company data and may not represent the entire placement statistics. Offer counts are used where available; otherwise, each company visit is counted as one entry.</p>
        </div>
    );
};
