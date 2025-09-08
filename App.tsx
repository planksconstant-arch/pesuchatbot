// Fix: Implemented the main App component to create a functional chat interface.
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { TypingIndicator } from './components/TypingIndicator';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AttendanceCalculator } from './components/AttendanceCalculator';
import { isGeminiAvailable, createChat } from './services/geminiService';
import { Message } from './types';
import { GREETING_MESSAGE } from './constants';
import { Chat } from '@google/genai';
import { PesLogo } from './components/PesLogo';
import { AnimatedText } from './components/AnimatedText';


// Fix: Add types for Web Speech API to resolve TypeScript errors. These APIs are not part of standard DOM typings.
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}


const geminiAvailable = isGeminiAvailable();

// Speech Recognition Hook
const useSpeechRecognition = (onResult: (transcript: string) => void) => {
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onResult(transcript);
                setIsListening(false);
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognition.onend = () => {
                 setIsListening(false);
            };
            recognitionRef.current = recognition;
        }
    }, [onResult]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    return { isListening, toggleListening };
};


function App() {
  const [messages, setMessages] = useState<Message[]>([GREETING_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // A flag to ensure the initial greeting isn't processed as a regular message
  const hasChatBegun = messages.length > 1;

  useEffect(() => {
    if (geminiAvailable) {
      chatRef.current = createChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const { isListening, toggleListening } = useSpeechRecognition((transcript) => {
      setInput(transcript);
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageWithText(input);
    setInput('');
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading || !chatRef.current) return;

    // If this is the first message, clear the suggestions
    const newMessages: Message[] = hasChatBegun ? [...messages] : [];
    
    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages([...newMessages, userMessage]);
    setIsLoading(true);
    
    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMessageId, text: '', sender: 'bot', isTyping: true }]);
    
    try {
        const stream = await chatRef.current.sendMessageStream({ message: text });
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: fullResponse, isTyping: true } : msg
            ));
        }
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: fullResponse, isTyping: false } : msg
        ));
    } catch (error) {
        console.error("Failed to send message:", error);
        setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: "Sorry, I encountered an error. Please try again.", isTyping: false } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  }

  if (!geminiAvailable) {
    return <ApiKeyPrompt />;
  }
  
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  );

  return (
    <div className="flex h-screen bg