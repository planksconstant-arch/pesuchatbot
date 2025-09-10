// Fix: Implemented Gemini service according to the provided guidelines.
import { GoogleGenAI } from '@google/genai';
import { Message } from '../types';

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

export function getAiInstance(): GoogleGenAI | null {
    if (!ai) {
        console.error("Gemini AI not initialized. API key might be missing.");
        return null;
    }
    return ai;
}

export const generateChatTitle = async (userPrompt: string, history: Message[]): Promise<string> => {
    if (!ai) {
        console.error("Gemini AI not initialized.");
        return "New Chat";
    }

    // Create a simplified history string for the prompt
    const historySummary = history.length > 1
        ? history
            .slice(-5) // Take last 5 messages
            .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text.substring(0, 150)}`)
            .join('\n')
        : "No previous messages.";

    const prompt = `
Generate a short, descriptive title (3-5 words) for a conversation.
The title should capture the main keywords or theme based on the user's first prompt and the conversation that follows.

First User Prompt: "${userPrompt}"

Conversation Snippet:
${historySummary}

Concise Title:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        // Clean up the title, remove quotes, etc.
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Failed to generate title:", error);
        return "New Chat"; // Fallback title
    }
};