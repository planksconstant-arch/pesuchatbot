// Fix: Implemented Gemini service according to the provided guidelines.
import { GoogleGenAI, Chat } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';

// Per guidelines, the API key must be obtained exclusively from process.env.API_KEY
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    // Per guidelines, use named parameter { apiKey: ... }
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    // The UI will show an ApiKeyPrompt component if this is the case.
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

export function isGeminiAvailable(): boolean {
    return !!ai;
}

export const createChat = (): Chat | null => {
    if (!ai) {
        console.error("Gemini AI not initialized. API key might be missing.");
        return null;
    }
    // Create a new chat session for each full page load/component mount
    const chat = ai.chats.create({
        // Per guidelines, use a valid model name
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
    return chat;
};
