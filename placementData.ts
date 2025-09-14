// This file contains structured placement data parsed from user-provided text.
// Note: This data is for demonstration purposes and may contain inconsistencies due to the nature of the source text.

export interface PlacementEntry {
    company: string;
    ctc: number; // Stored as a number for sorting, in LPA
    ctcText: string; // Original text for display
    role: string;
    offers: number | null;
    category: 'Core IT/Software' | 'FinTech' | 'E-commerce/Product' | 'Finance' | 'Consulting' | 'Core ECE/Hardware' | 'Other';
}

export interface CollegePlacementData {
    id: string;
    name: string;
    year: string;
    summary: {
        totalOffers: number;
        highestCtc: number;
    };
    entries: PlacementEntry[];
}

export const placementData: CollegePlacementData[] = [
    {
        id: 'pes-2025',
        name: 'PES University',
        year: '2026 Batch',
        summary: {
            totalOffers: 85, // Updated based on sheet
            highestCtc: 56,
        },
        entries: [
            { company: 'Zomato', ctc: 56, ctcText: '56 LPA (24 Base)', role: 'SDE', offers: 3, category: 'E-commerce/Product' },
            { company: 'DE Shaw', ctc: 50, ctcText: '50 LPA (18 Base)', role: 'SDE (Test Engineer)', offers: 1, category: 'Finance' },
            { company: 'VISA', ctc: 41, ctcText: '41 LPA (16 Base)', role: 'SDE', offers: 3, category: 'FinTech' },
            { company: 'Palo Alto Networks', ctc: 41, ctcText: '41 LPA (PPO)', role: 'SE, FinOps, SRE', offers: 3, category: 'Core IT/Software' },
            { company: 'Bitgo', ctc: 33, ctcText: '33 LPA (15 Base)', role: 'SDE', offers: 2, category: 'FinTech' },
            { company: 'PhonePe', ctc: 32, ctcText: '32 LPA (19 base)', role: 'SDE', offers: 3, category: 'FinTech' },
            { company: 'CommVault', ctc: 32, ctcText: '32 LPA (16 Base)', role: 'SDE', offers: 2, category: 'Core IT/Software' },
            { company: 'Meesho', ctc: 32, ctcText: '32 LPA (20 Base)', role: 'SDE', offers: 4, category: 'E-commerce/Product' },
            { company: 'Cleartrip (Flipkart)', ctc: 32, ctcText: '32 LPA (18 Base)', role: 'SDE1', offers: 4, category: 'E-commerce/Product' },
            { company: 'Vyapar Apps', ctc: 30, ctcText: '30 LPA (15 Base)', role: 'SDE', offers: 4, category: 'FinTech' },
            { company: 'Nvidia', ctc: 29, ctcText: '29 LPA', role: 'Software Intern', offers: 1, category: 'Core ECE/Hardware' },
            { company: 'Okta', ctc: 28, ctcText: '28 LPA (14 Base)', role: 'SDE', offers: 8, category: 'Core IT/Software' },
            { company: 'CouchBase', ctc: 27, ctcText: '27 LPA (20 Base)', role: 'SDE, QE, Support', offers: 12, category: 'Core IT/Software' },
            { company: 'SAP Labs', ctc: 25, ctcText: '25 LPA (10 Base)', role: 'Associate', offers: 10, category: 'Core IT/Software' },
            { company: 'Renesas', ctc: 24, ctcText: '24 LPA (15 Base)', role: 'Verification Engineer', offers: 5, category: 'Core ECE/Hardware' },
            { company: 'Akamai Technologies', ctc: 24, ctcText: '24 LPA (14 Base)', role: 'SWE - IT/DevOps', offers: 2, category: 'Core IT/Software' },
            { company: 'Walmart', ctc: 22.6, ctcText: '22.6 LPA (16 Base)', role: 'SDE - II', offers: 6, category: 'E-commerce/Product' },
            { company: 'NXP Semiconductors', ctc: 22.5, ctcText: '22.5 LPA', role: 'Embedded, Digital', offers: 1, category: 'Core ECE/Hardware' },
            { company: 'F5 Innovations', ctc: 20, ctcText: '20 CTC', role: 'QA Engineer', offers: 6, category: 'Core IT/Software' },
            { company: 'Twilio', ctc: 19, ctcText: '19 LPA (12 Base)', role: 'SDE', offers: 5, category: 'Core IT/Software'},
        ]
    },
    {
        id: 'pes-2025',
        name: 'PES University (EC Campus)',
        year: '2025 Batch',
        summary: {
            totalOffers: 176, // Updated based on sheet
            highestCtc: 62,
        },
        entries: [
            { company: 'Cohesity', ctc: 62, ctcText: '62 LPA (20 Base)', role: 'SDE', offers: 2, category: 'Core IT/Software' },
            { company: 'Atlassian', ctc: 52, ctcText: '52 LPA', role: 'SDE', offers: 2, category: 'Core IT/Software' },
            { company: 'Google', ctc: 50, ctcText: '50 LPA', role: 'SDE', offers: 1, category: 'Core IT/Software' },
            { company: 'Microsoft', ctc: 50, ctcText: '50 LPA (22 Base)', role: 'SDE', offers: 5, category: 'Core IT/Software' },
            { company: 'Amazon', ctc: 45, ctcText: '45 LPA (18 Base)', role: 'SDE', offers: 12, category: 'E-commerce/Product' },
            { company: 'Intuit', ctc: 43, ctcText: '43 LPA', role: 'SDE', offers: 8, category: 'FinTech' },
            { company: 'De-Shaw', ctc: 39, ctcText: '39 LPA', role: 'SDE', offers: 3, category: 'Finance' },
            { company: 'ServiceNow', ctc: 39, ctcText: '39 LPA', role: 'SDE', offers: 5, category: 'Core IT/Software' },
            { company: 'Workday', ctc: 38, ctcText: '38 LPA', role: 'SDE', offers: 3, category: 'Core IT/Software' },
            { company: 'Palo Alto Networks', ctc: 37, ctcText: '37 LPA', role: 'SDE', offers: 4, category: 'Core IT/Software' },
            { company: 'Nvidia', ctc: 36, ctcText: '36 LPA', role: 'SDE', offers: 6, category: 'Core ECE/Hardware' },
            { company: 'VMware', ctc: 35, ctcText: '35 LPA', role: 'MTS', offers: 10, category: 'Core IT/Software' },
            { company: 'Goldman Sachs', ctc: 34, ctcText: '34 LPA', role: 'Analyst', offers: 8, category: 'Finance' },
            { company: 'Cisco', ctc: 33, ctcText: '33 LPA', role: 'SDE', offers: 15, category: 'Core IT/Software' },
            { company: 'Arista Networks', ctc: 32, ctcText: '32 LPA', role: 'SDE', offers: 7, category: 'Core IT/Software' },
            { company: 'SAP Labs', ctc: 31, ctcText: '31 LPA', role: 'Associate Developer', offers: 12, category: 'Core IT/Software' },
            { company: 'Oracle', ctc: 30, ctcText: '30 LPA', role: 'SDE', offers: 20, category: 'Core IT/Software' },
            { company: 'J.P. Morgan', ctc: 28, ctcText: '28 LPA', role: 'SDE', offers: 18, category: 'Finance' },
            { company: 'Wells Fargo', ctc: 27, ctcText: '27 LPA', role: 'Analyst', offers: 15, category: 'Finance' },
        ]
    },
    {
        id: 'bms',
        name: 'BMS College of Engineering',
        year: '2024 Batch',
        summary: {
            totalOffers: 350, // Approximation
            highestCtc: 56.3,
        },
        entries: [
            { company: 'DE Shaw', ctc: 56.3, ctcText: '56.3 LPA', role: 'SDET', offers: 2, category: 'Finance' },
            { company: 'Fivetran', ctc: 38, ctcText: '38 LPA (PBC)', role: 'Intern Software Engineer', offers: 4, category: 'Core IT/Software' },
            { company: 'PhonePe', ctc: 33.57, ctcText: '33.57 LPA', role: 'Software Developer Engineer', offers: 2, category: 'FinTech' },
            { company: 'Nvidia', ctc: 31.45, ctcText: '31.45 LPA', role: 'Software Engineering Intern', offers: 0, category: 'Core ECE/Hardware' },
            { company: 'AtoB', ctc: 30, ctcText: '30 LPA', role: 'Software Engineer', offers: null, category: 'FinTech' },
            { company: 'Morgan Stanley', ctc: 29.48, ctcText: '29.48 LPA (13 Base)', role: 'Apprenticeship', offers: 4, category: 'Finance' },
            { company: 'Nvidia', ctc: 29, ctcText: '29 LPA', role: 'Hardware Enginnering Intern', offers: 0, category: 'Core ECE/Hardware' },
            { company: 'Catalog', ctc: 25, ctcText: '25 LPA (8.21 Fixed)', role: 'Software Developer', offers: null, category: 'Core IT/Software' },
            { company: 'NXP Semiconductors', ctc: 23, ctcText: '23 LPA', role: 'Software Engineer', offers: null, category: 'Core ECE/Hardware' },
            { company: 'AmuseLabs', ctc: 22, ctcText: '22 LPA (PPO)', role: 'Intern', offers: 1, category: 'Core IT/Software' },
            { company: 'Caastle', ctc: 22, ctcText: '22 LPA', role: 'Software Engineer', offers: 1, category: 'E-commerce/Product' },
            { company: 'JPMorgan Chase & Co.', ctc: 19.75, ctcText: '19.75 LPA', role: 'FTE + Summer Intern', offers: 14, category: 'Finance' },
            { company: 'Arista', ctc: 19.5, ctcText: '19.5 CTC (16 Base)', role: 'FTE', offers: 4, category: 'Core IT/Software' },
            { company: 'Texas Instruments', ctc: 19.55, ctcText: '19.55 LPA (PPO)', role: 'Layout Intern', offers: 6, category: 'Core ECE/Hardware' },
            { company: 'Oracle', ctc: 19, ctcText: '19 LPA', role: 'Associate Software Engineer', offers: 15, category: 'Core IT/Software' },
            { company: 'Lowe\'s India', ctc: 18.8, ctcText: '18.8 LPA', role: 'Associate Software Engineer', offers: null, category: 'E-commerce/Product' },
            { company: 'IBM (ISDL & ISL)', ctc: 18.75, ctcText: '18.75 LPA', role: 'Software Engineer', offers: 47, category: 'Core IT/Software' },
            { company: 'Rapido', ctc: 18, ctcText: '18 LPA', role: 'Associate Product Engineer', offers: 1, category: 'E-commerce/Product' },
            { company: 'Acko General Insurance', ctc: 18, ctcText: '18 LPA + 15% variable', role: 'SDE Intern', offers: null, category: 'FinTech' },
            { company: 'HPE (CTY)', ctc: 17.5, ctcText: '17.5 LPA', role: 'FTE + Intern', offers: 6, category: 'Core IT/Software' },
            { company: 'HPE', ctc: 17.5, ctcText: '17.5 LPA', role: 'Software Engineer', offers: 18, category: 'Core IT/Software' },
            { company: 'Avalara', ctc: 17.5, ctcText: '17.5 LPA', role: 'Software Engineer', offers: 5, category: 'FinTech' },
        ]
    },
    {
        id: 'msrit',
        name: 'M.S. Ramaiah Institute of Technology',
        year: '2024 Batch',
        summary: {
            totalOffers: 200, // Approximation
            highestCtc: 32,
        },
        entries: [
            { company: 'Microsoft', ctc: 32, ctcText: '32 CTC', role: 'FTE', offers: 1, category: 'Core IT/Software' },
            { company: 'Expedia', ctc: 31, ctcText: '31 CTC (15 Base)', role: 'FTE', offers: 6, category: 'E-commerce/Product' },
            { company: 'Morgan Stanley', ctc: 29.48, ctcText: '29.48 CTC (13 Base)', role: 'FTE', offers: 4, category: 'Finance' },
            { company: 'JPMC (thru Hackathon)', ctc: 19.3, ctcText: '19.3 CTC (13 Base)', role: 'FTE', offers: 7, category: 'Finance' },
            { company: 'Arista', ctc: 19.5, ctcText: '19.5 CTC (16 Base)', role: 'FTE', offers: 4, category: 'Core IT/Software' },
            { company: 'HPE (Catch Them Young - CTY)', ctc: 17.5, ctcText: '17.5 CTC (12 Base)', role: 'FTE', offers: 12, category: 'Core IT/Software' },
            { company: 'Akamai', ctc: 18, ctcText: '18 CTC (12 Base)', role: 'FTE', offers: 5, category: 'Core IT/Software' },
            { company: 'G2', ctc: 15, ctcText: '15 CTC', role: 'FTE', offers: 1, category: 'E-commerce/Product' },
            { company: 'Dover', ctc: 13, ctcText: '13 CTC (11 Base)', role: 'FTE', offers: 1, category: 'Other' },
            { company: 'Fidelity', ctc: 12, ctcText: '12 CTC (10 Base)', role: 'FTE', offers: 3, category: 'Finance' },
            { company: 'UPL', ctc: 10, ctcText: '10 CTC', role: 'FTE', offers: 1, category: 'Other' },
            { company: 'GoldmanSachs', ctc: 10, ctcText: 'Not Specified', role: 'FTE', offers: 1, category: 'Finance' },
        ]
    },
    {
        id: 'vit',
        name: 'Vellore Institute of Technology',
        year: '2024 Batch',
        summary: {
            totalOffers: 4500, // Approximation
            highestCtc: 100,
        },
        entries: [
            { company: 'Motorq PPO', ctc: 100, ctcText: '100.0 LPA', role: 'SDE', offers: 1, category: 'Core IT/Software' },
            { company: 'BALKAN ID', ctc: 75, ctcText: '75.0 LPA', role: 'SDE', offers: 2, category: 'Core IT/Software' },
            { company: 'Google', ctc: 60, ctcText: '60.0 LPA', role: 'SDE', offers: 5, category: 'Core IT/Software' },
            { company: 'Zomato', ctc: 56, ctcText: '56.0 LPA', role: 'SDE', offers: 2, category: 'E-commerce/Product' },
            { company: 'Microsoft PPO', ctc: 55, ctcText: '55.0 LPA', role: 'SDE', offers: 6, category: 'Core IT/Software' },
            { company: 'Amazon', ctc: 47, ctcText: '47.0 LPA', role: 'SDE', offers: 7, category: 'E-commerce/Product' },
            { company: 'Adobe PPO', ctc: 45, ctcText: '45.0 LPA', role: 'SDE', offers: 3, category: 'Core IT/Software' },
            { company: 'Intuit PPO', ctc: 45, ctcText: '45.0 LPA', role: 'SDE', offers: 3, category: 'FinTech' },
            { company: 'Service Now PPO', ctc: 44, ctcText: '44.0 LPA', role: 'SDE', offers: 3, category: 'Core IT/Software' },
            { company: 'Okta', ctc: 43.2, ctcText: '43.2 LPA', role: 'SDE', offers: 5, category: 'Core IT/Software' },
            { company: 'Visa PPO', ctc: 41, ctcText: '41.0 LPA', role: 'SDE', offers: 4, category: 'FinTech' },
            { company: 'Moveworks', ctc: 41, ctcText: '41.0 LPA', role: 'SDE', offers: 1, category: 'Core IT/Software' },
            { company: 'Electronic Arts', ctc: 38, ctcText: '38.0 LPA', role: 'SDE', offers: 1, category: 'Other' },
            { company: 'Paypal PPO', ctc: 34.4, ctcText: '34.4 LPA', role: 'SDE', offers: 4, category: 'FinTech' },
            { company: 'Marvell PPO', ctc: 33.8, ctcText: '33.8 LPA', role: 'SDE', offers: 2, category: 'Core ECE/Hardware' },
            { company: 'Commvault', ctc: 33, ctcText: '33.0 LPA', role: 'SDE', offers: 5, category: 'Core IT/Software' },
            { company: 'NVIDIA', ctc: 32, ctcText: '32.0 LPA', role: 'SDE', offers: 3, category: 'Core ECE/Hardware' },
            { company: 'Wells Fargo', ctc: 24, ctcText: '24.0 LPA', role: 'SDE', offers: 18, category: 'Finance' },
            { company: 'JPMorgan PPO', ctc: 19.8, ctcText: '19.8 LPA', role: 'SDE', offers: 28, category: 'Finance' },
            { company: 'Oracle PPO', ctc: 19.2, ctcText: '19.2 LPA', role: 'SDE', offers: 6, category: 'Core IT/Software' },
            { company: 'Blackrock', ctc: 18.8, ctcText: '18.8 LPA', role: 'SDE', offers: 47, category: 'Finance' },
            { company: 'Optum', ctc: 18.5, ctcText: '18.5 LPA', role: 'SDE', offers: 16, category: 'Other' },
            { company: 'HPE', ctc: 17.5, ctcText: '17.5 LPA', role: 'SDE', offers: 11, category: 'Core IT/Software' },
            { company: 'Cisco', ctc: 24.7, ctcText: '24.7 LPA', role: 'SDE', offers: 2, category: 'Core IT/Software' },
            { company: 'Accenture AEH', ctc: 11.8, ctcText: '11.8 LPA', role: 'Consultant', offers: 95, category: 'Consulting' },
            { company: 'Deloitte', ctc: 7.6, ctcText: '7.6 LPA', role: 'Analyst', offers: 98, category: 'Consulting' },
            { company: 'TCS', ctc: 3.5, ctcText: '3.5 - 9.0 LPA', role: 'Engineer', offers: 1164, category: 'Consulting' },
            { company: 'Cognizant', ctc: 4.2, ctcText: '4.2 LPA', role: 'Engineer', offers: 361, category: 'Consulting' },
            { company: 'LTIMindtree', ctc: 4.0, ctcText: '4.0 LPA', role: 'Engineer', offers: 285, category: 'Consulting' },
        ]
    }
];
