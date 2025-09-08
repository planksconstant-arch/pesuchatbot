// Fix: Populating file with necessary type definitions for the application.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
  suggestions?: string[];
}