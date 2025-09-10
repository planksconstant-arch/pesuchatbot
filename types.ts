// Fix: Populating file with necessary type definitions for the application.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
  suggestions?: string[];
  sources?: GroundingChunk[]; // For Google Search results
  contentType?: 'text' | 'video' | 'image';
  contentUrl?: string;
  videoLabel?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

// Type for grounding chunks from Google Search
export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}