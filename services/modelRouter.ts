// A service to automatically select the best model persona based on the user's prompt.
export type Persona = 'pespresso' | 'grok' | 'claude' | 'chatgpt' | 'qwen' | 'deepseek';

// Define keyword sets with weights for more nuanced routing.
// Higher weight = stronger indicator for that persona.
const personaKeywords: Record<string, Record<string, number>> = {
    deepseek: {
        'code': 5, 'javascript': 5, 'python': 5, 'react': 5, 'typescript': 5, 'node.js': 5, 'html': 5, 'css': 5,
        'function': 4, 'class': 4, 'array': 4, 'object': 4, 'algorithm': 4, 'data structure': 4,
        'debug': 6, 'error': 6, 'bug': 6, 'fix': 6, 'install': 3, 'configure': 3, 'server': 3, 'database': 3, 'api': 3,
        'write a function': 8, 'generate code': 8, 'implement': 5, 'refactor': 7
    },
    pespresso: {
        'pes': 10, 'pesu': 10, 'university': 5, 'campus': 8, 'admission': 8, 'course': 6, 'exam': 8, 'isa': 10, 'esa': 10,
        'professor': 7, 'faculty': 7, 'event': 6, 'fest': 7, 'hostel': 9, 'attendance': 9, 'fee': 7, 'syllabus': 7, 'mrd aud': 9,
        'ramaiah': 9, 'ring road': 9, 'ec campus': 9, 'rr campus': 9, 'placement': 8
    },
    grok: {
        'roast': 10, 'sarcastic': 9, 'joke': 7, 'funny': 6, 'cynical': 8,
        "what's the deal with": 8, "give me a hot take": 9
    },
    claude: {
        'ethics': 9, 'ethical': 9, 'moral': 8, 'safety': 9, 'safe': 8, 'harmless': 7,
        'explain in detail': 6, 'balanced view': 8, 'pros and cons': 7, 'what are the implications': 8
    },
    qwen: {
        'translate': 6, 'in french': 5, 'in japanese': 5, 'in spanish': 5,
        'cultural': 5, 'etymology': 4
    },
    chatgpt: {} // Default, no specific keywords needed
};


/**
 * Analyzes the user's prompt and returns the most suitable persona.
 * @param prompt - The user's input string.
 * @returns The recommended persona ID.
 */
export const selectBestPersona = (prompt: string): Persona => {
    const lowerCasePrompt = prompt.toLowerCase();
    const scores: Record<string, number> = {
        pespresso: 0,
        grok: 0,
        claude: 0,
        chatgpt: 1, // Start with a default score of 1 to be the fallback
        qwen: 0,
        deepseek: 0,
    };

    // Calculate scores based on keyword matches
    for (const persona in personaKeywords) {
        for (const keyword in personaKeywords[persona as Persona]) {
            if (lowerCasePrompt.includes(keyword)) {
                scores[persona as Persona] += personaKeywords[persona as Persona][keyword];
            }
        }
    }

    // Determine the persona with the highest score
    let bestPersona: Persona = 'chatgpt';
    let maxScore = 0;

    for (const persona in scores) {
        if (scores[persona as Persona] > maxScore) {
            maxScore = scores[persona as Persona];
            bestPersona = persona as Persona;
        }
    }

    // If no strong signals are found (maxScore is still low), default to a general model.
    if (maxScore < 5) {
        return 'chatgpt';
    }

    return bestPersona as Persona;
};
