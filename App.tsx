import React, { useState, useEffect, useRef } from 'react';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { AttendanceCalculator } from './components/AttendanceCalculator';
import { CampusMapModal } from './components/CampusMapModal';
import { NearbyHangoutsModal } from './components/NearbyHangoutsModal';
import { Sidebar } from './components/Sidebar';
import { VirtualTourModal } from './components/VirtualTourModal';
import { getAiInstance, generateChatTitle, isGeminiAvailable } from './services/geminiService';
import { ChatSession, Message } from './types';
import { PERSONA_INSTRUCTIONS, PERPLEXITY_INSTRUCTION, MEME_TRIGGERS, N8N_WORKFLOW_INSTRUCTION, N8N_SUMMARIZE_INSTRUCTION, N8N_ALUMNI_SEARCH_INSTRUCTION, N8N_QUESTION_PAPER_INSTRUCTION, PERSONA_DESCRIPTIONS, N8N_BOOK_SEARCH_INSTRUCTION } from './constants';
import { PesLogo } from './components/PesLogo';
import { AnimatedText } from './components/AnimatedText';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { TypingIndicator } from './components/TypingIndicator';
import { EmbeddedVideoPlayer } from './components/EmbeddedVideoPlayer';
import { TimetableModal } from './components/TimetableModal';
import { IntegrationsModal } from './components/IntegrationsModal';
import { PlacementDataModal } from './components/PlacementDataModal';
import { YapLapLogo } from './components/YapLapLogo';
import { selectBestPersona } from './services/modelRouter';


const StaticBackground = () => (
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-black z-0"></div>
);

const PetalFall: React.FC = () => {
    const petals = Array.from({ length: 40 });
    return (
        <div className="petal-fall-container">
            {petals.map((_, i) => {
                const animationName = `petal-fall-${(i % 3) + 1}`;
                const randomSize = Math.random() * 6 + 5; // Petal size from 5px to 11px
                const style = {
                    left: `${Math.random() * 100}vw`,
                    animationName,
                    animationDuration: `${Math.random() * 8 + 7}s`,
                    animationDelay: `${Math.random() * 10}s`,
                    width: `${randomSize}px`,
                    height: `${randomSize * 0.75}px`, // Create oval shape
                };
                return <div key={i} className="petal" style={style}></div>;
            })}
        </div>
    );
};

const TITLES = [
    "PESpresso",
    "ペスプレッソ", // Japanese
];


type SearchProvider = 'off' | 'google' | 'perplexity';

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [modelProvider, setModelProvider] = useState('pespresso');
    const [searchProvider, setSearchProvider] = useState<SearchProvider>('off');
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [isLargeFont, setIsLargeFont] = useState(false);
    const [animatedTitle, setAnimatedTitle] = useState(TITLES[0]);
    const [titleIndex, setTitleIndex] = useState(0);

    const [modalsOpen, setModalsOpen] = useState({
        virtualTour: false,
        attendance: false,
        campusMap: false,
        nearbyHangouts: false,
        timetable: false,
        integrations: false,
        placementData: false,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const speechRecognitionRef = useRef<any>(null);

    const activeChat = chatHistory.find(c => c.id === activeChatId);
    const messages = activeChat ? activeChat.messages : [];

    useEffect(() => {
        const titleInterval = setInterval(() => {
            setTitleIndex(prevIndex => (prevIndex + 1) % TITLES.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(titleInterval);
    }, []);

    useEffect(() => {
        setAnimatedTitle(TITLES[titleIndex]);
    }, [titleIndex]);

    useEffect(() => {
        try {
            setIsHistoryLoading(true);
            const storedHistory = localStorage.getItem('pes-yaplap-history');
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                setChatHistory(parsedHistory);
                const lastChatId = parsedHistory[0]?.id;
                if (lastChatId) {
                    setActiveChatId(lastChatId);
                } else {
                    handleNewChat();
                }
            } else {
                handleNewChat();
            }
            
            const storedFontSize = localStorage.getItem('pes-yaplap-font-size');
            if (storedFontSize === 'large') {
                setIsLargeFont(true);
            }

        } catch (error) {
            console.error("Failed to load chat history:", error);
            handleNewChat();
        } finally {
            setIsHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('pes-yaplap-history', JSON.stringify(chatHistory));
        } else {
            localStorage.removeItem('pes-yaplap-history');
        }
    }, [chatHistory]);

    useEffect(() => {
        localStorage.setItem('pes-yaplap-font-size', isLargeFont ? 'large' : 'normal');
    }, [isLargeFont]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        const chatNeedingTitle = chatHistory.find(chat =>
            chat.id === activeChatId &&
            chat.title === 'New Chat' &&
            chat.messages.length >= 2 && // Ensure at least a user and bot message exist
            !isGenerating
        );

        if (chatNeedingTitle) {
            const lastMessage = chatNeedingTitle.messages[chatNeedingTitle.messages.length - 1];
            if (lastMessage.sender === 'bot' && !lastMessage.isTyping) {
                const firstUserPrompt = chatNeedingTitle.messages.find(m => m.sender === 'user')?.text;

                if (firstUserPrompt) {
                    const generateAndSetTitle = async () => {
                        // Double-check inside async function to prevent race conditions
                        const latestChat = chatHistory.find(c => c.id === activeChatId);
                        if (latestChat?.title !== 'New Chat') {
                            return;
                        }
                        
                        const newTitle = await generateChatTitle(firstUserPrompt, chatNeedingTitle.messages);
                        
                        setChatHistory(prev => prev.map(chat =>
                            chat.id === activeChatId ? { ...chat, title: newTitle } : chat
                        ));
                    };
                    generateAndSetTitle();
                }
            }
        }
    }, [chatHistory, activeChatId, isGenerating]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
                handleSendMessage(transcript);
            };
            speechRecognitionRef.current = recognition;
        }
    }, []);

    const handleVoiceInput = () => {
        if (isListening) {
            speechRecognitionRef.current?.stop();
        } else {
            speechRecognitionRef.current?.start();
        }
    };
    
    const handleCopyText = (text: string, messageId: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedMessageId(messageId);
                setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    const handleN8nWorkflow = async (
        prompt: string, 
        platform: string,
        instructionTemplate: (queryOrTopic: string) => string
    ) => {
        const ai = getAiInstance();
        if (!ai) return;

        setIsGenerating(true);
        const userMessage: Message = { id: `user-${Date.now()}`, text: prompt, sender: 'user' };
        
        // Auto-select persona for this workflow
        const selectedPersona = selectBestPersona(prompt);
        setModelProvider(selectedPersona);

        let currentChatId = activeChatId;
        if (!activeChatId || (activeChat && activeChat.messages.length === 0)) {
            const newChatId = `chat-${Date.now()}`;
            const newChatSession: ChatSession = { id: newChatId, title: 'New Chat', messages: [userMessage] };
            setChatHistory(prev => [newChatSession, ...prev.filter(c => c.messages.length > 0 || c.id !== activeChatId)]);
            setActiveChatId(newChatId);
            currentChatId = newChatId;
        } else {
            setChatHistory(prev => prev.map(chat =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
            ));
        }

        const botTypingMessage: Message = { id: `bot-${Date.now()}`, text: '', sender: 'bot', isTyping: true };
        setChatHistory(prev => prev.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, botTypingMessage] } : chat
        ));
        
        try {
            const workflowPrompt = instructionTemplate(prompt);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: workflowPrompt }] }],
                config: {
                    tools: [{ googleSearch: {} }],
                    systemInstruction: PERSONA_INSTRUCTIONS[selectedPersona]
                }
            });

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const sources = groundingChunks
                .filter(chunk => chunk.web?.uri && chunk.web?.title)
                .map(chunk => ({
                    web: {
                        uri: chunk.web!.uri!,
                        title: chunk.web!.title!,
                    },
                }));

            const botMessage: Message = { ...botTypingMessage, text: response.text, sources, isTyping: false };
            setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? { ...chat, messages: [...chat.messages.slice(0, -1), botMessage] } : chat));
        } catch (error) {
             console.error("Error during n8n workflow:", error);
            const errorText = "Sorry, I couldn't fetch the data. The workflow might be down.";
            const errorMessage: Message = { ...botTypingMessage, text: errorText, isTyping: false };
            setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? { ...chat, messages: [...chat.messages.slice(0, -1), errorMessage] } : chat));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageGeneration = async (fullPrompt: string, imagePrompt: string) => {
        const ai = getAiInstance();
        if (!ai) return;

        setIsGenerating(true);
        const userMessage: Message = { id: `user-${Date.now()}`, text: fullPrompt, sender: 'user' };

        let currentChatId = activeChatId;
        if (!activeChatId || (activeChat && activeChat.messages.length === 0)) {
            const newChatId = `chat-${Date.now()}`;
            const newChatSession: ChatSession = { id: newChatId, title: 'New Chat', messages: [userMessage] };
            setChatHistory(prev => [newChatSession, ...prev.filter(c => c.messages.length > 0 || c.id !== activeChatId)]);
            setActiveChatId(newChatId);
            currentChatId = newChatId;
        } else {
            setChatHistory(prev => prev.map(chat =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
            ));
        }

        const botTypingMessage: Message = { id: `bot-${Date.now()}`, text: '', sender: 'bot', isTyping: true };
        setChatHistory(prev => prev.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, botTypingMessage] } : chat
        ));
        
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                },
            });
    
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    
            const botImageMessage: Message = {
                id: botTypingMessage.id,
                sender: 'bot',
                text: `Here is the image I generated for: "${imagePrompt}"`,
                contentType: 'image',
                contentUrl: imageUrl,
                isTyping: false,
            };

            setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? { ...chat, messages: [...chat.messages.slice(0, -1), botImageMessage] } : chat));
        } catch (error) {
             console.error("Error generating image:", error);
            const errorText = "Sorry, I couldn't generate that image. The prompt might have been rejected. Please try something else.";
            const errorMessage: Message = { ...botTypingMessage, text: errorText, isTyping: false };
            setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? { ...chat, messages: [...chat.messages.slice(0, -1), errorMessage] } : chat));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendMessage = async (prompt?: string) => {
        const messageText = (prompt || userInput).trim();
        const ai = getAiInstance();
        if (!messageText || isGenerating || !ai) return;
        
        // Auto-select the best persona for this query
        const selectedPersona = selectBestPersona(messageText);
        setModelProvider(selectedPersona);

        const lowerCaseMessage = messageText.toLowerCase();

        // High priority triggers for modals and special workflows
        const placementTriggers = ['placement', 'placements', 'placement data', 'placement stats', '2025 placement', '2026 placement'];
        if (placementTriggers.some(trigger => lowerCaseMessage.includes(trigger))) {
            handleModalToggle('placementData', true);
            setUserInput('');
            return;
        }

        const hostelTriggers = ['hostel review', 'hostel reviews', 'best hostel', 'pes hostel'];
        if (hostelTriggers.some(trigger => lowerCaseMessage.includes(trigger))) {
            setUserInput('');
            return handleN8nWorkflow(messageText, 'Reddit', (query) => N8N_SUMMARIZE_INSTRUCTION('Reddit', 'PES University Hostels'));
        }
        
        const alumniTriggers = ['alumni', 'find alumni', 'search alumni', 'pes alumni on linkedin'];
        if (alumniTriggers.some(trigger => lowerCaseMessage.includes(trigger))) {
            setUserInput('');
            return handleN8nWorkflow(messageText, 'LinkedIn', N8N_ALUMNI_SEARCH_INSTRUCTION);
        }

        const qpTriggers = ['question paper', 'previous year paper', 'pyq', 'exam papers'];
        if (qpTriggers.some(trigger => lowerCaseMessage.includes(trigger))) {
            setUserInput('');
            return handleN8nWorkflow(messageText, 'Academic Sources', N8N_QUESTION_PAPER_INSTRUCTION);
        }

        const bookTriggers = ['find book', 'search book', 'recommend book', 'textbook for'];
        if (bookTriggers.some(trigger => lowerCaseMessage.includes(trigger))) {
            setUserInput('');
            return handleN8nWorkflow(messageText, "Digital Libraries", N8N_BOOK_SEARCH_INSTRUCTION);
        }

        // Image Generation Check
        const imageTriggers = [
            'generate an image of', 'create an image of', 'draw a picture of', 'imagine a picture of',
            'generate image of', 'create image of', 'draw', 'imagine'
        ].sort((a, b) => b.length - a.length);

        for (const trigger of imageTriggers) {
            if (lowerCaseMessage.startsWith(trigger + ' ')) {
                const imagePrompt = messageText.substring(trigger.length).trim();
                if (imagePrompt) {
                    setUserInput('');
                    return handleImageGeneration(messageText, imagePrompt);
                }
            }
        }
        
        // Generic n8n workflow triggers
        let n8nPlatform: 'Hacker News' | 'Reddit' | null = null;
        if (lowerCaseMessage.includes('hacker news') || lowerCaseMessage.includes(' hn')) {
            n8nPlatform = 'Hacker News';
        } else if (lowerCaseMessage.includes('reddit')) {
            n8nPlatform = 'Reddit';
        }

        if (n8nPlatform) {
            setUserInput('');
            // Fix: The instructionTemplate function passed to handleN8nWorkflow should only take one argument (the query).
            // The platform is captured from the current scope.
            return handleN8nWorkflow(messageText, n8nPlatform, (query) => N8N_WORKFLOW_INSTRUCTION(n8nPlatform!, query));
        }

        // Local meme triggers
        for (const trigger in MEME_TRIGGERS) {
            if (lowerCaseMessage.includes(trigger)) {
                const userMessage: Message = { id: `user-${Date.now()}`, text: messageText, sender: 'user' };
                const memeData = MEME_TRIGGERS[trigger];
                const botMemeMessage: Message = {
                    id: `bot-meme-${Date.now()}`, sender: 'bot',
                    text: memeData.text, contentType: memeData.contentType,
                    contentUrl: memeData.contentUrl, videoLabel: memeData.videoLabel
                };

                let currentChatId = activeChatId;
                if (!activeChatId || (activeChat && activeChat.messages.length === 0)) {
                    const newChatId = `chat-${Date.now()}`;
                    currentChatId = newChatId;
                    const newChatSession: ChatSession = { id: newChatId, title: 'New Chat', messages: [userMessage, botMemeMessage] };
                    setChatHistory(prev => [newChatSession, ...prev.filter(c => c.messages.length > 0 || c.id !== activeChatId)]);
                    setActiveChatId(newChatId);
                } else {
                    setChatHistory(prev => prev.map(chat =>
                        chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage, botMemeMessage] } : chat
                    ));
                }
                setUserInput('');
                return; // Stop execution
            }
        }

        // Standard chat flow
        setIsGenerating(true);
        const userMessage: Message = { id: `user-${Date.now()}`, text: messageText, sender: 'user' };

        let currentChatId = activeChatId;
        if (!activeChatId || (activeChat && activeChat.messages.length === 0)) {
            const newChatId = `chat-${Date.now()}`;
            const newChatSession: ChatSession = { id: newChatId, title: 'New Chat', messages: [userMessage] };
            setChatHistory(prev => [newChatSession, ...prev.filter(c => c.messages.length > 0 || c.id !== activeChatId)]);
            setActiveChatId(newChatId);
            currentChatId = newChatId;
        } else {
            setChatHistory(prev => prev.map(chat =>
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
            ));
        }

        setUserInput('');
        const botTypingMessage: Message = { id: `bot-${Date.now()}`, text: '', sender: 'bot', isTyping: true };
        setChatHistory(prev => prev.map(chat =>
            chat.id === currentChatId ? { ...chat, messages: [...chat.messages, botTypingMessage] } : chat
        ));

        const history = activeChat?.messages
            .filter(m => !m.isTyping)
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            })) ?? [];
        
        let systemInstruction = PERSONA_INSTRUCTIONS[selectedPersona];
        if (searchProvider === 'perplexity') {
            systemInstruction += `\n\n${PERPLEXITY_INSTRUCTION}`;
        }

        try {
            if (searchProvider !== 'off') {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [...history, { role: 'user', parts: [{ text: messageText }] }],
                    config: {
                        tools: [{ googleSearch: {} }],
                        systemInstruction
                    }
                });
                const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                const sources = groundingChunks
                    .filter(chunk => chunk.web?.uri && chunk.web?.title)
                    .map(chunk => ({
                        web: {
                            uri: chunk.web!.uri!,
                            title: chunk.web!.title!,
                        },
                    }));
                const botMessage: Message = { ...botTypingMessage, text: response.text, sources, isTyping: false };
                setChatHistory(prev => prev.map(chat => chat.id === currentChatId ? { ...chat, messages: [...chat.messages.slice(0, -1), botMessage] } : chat));
            } else {
                const stream = await ai.models.generateContentStream({
                    model: 'gemini-2.5-flash',
                    contents: [...history, { role: 'user', parts: [{ text: messageText }] }],
                    config: { systemInstruction }
                });
                let responseText = '';
                for await (const chunk of stream) {
                    responseText += chunk.text;
                    setChatHistory(prev => prev.map(chat => {
                        if (chat.id === currentChatId) {
                            const updatedMessages = chat.messages.map(msg =>
                                msg.id === botTypingMessage.id ? { ...msg, text: responseText, isTyping: false } : msg
                            );
                            return { ...chat, messages: updatedMessages };
                        }
                        return chat;
                    }));
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            let errorText = "Oops! Something went wrong. Please try again.";
            if (error instanceof Error) {
                errorText = `An API error occurred: ${error.message}`;
            }
            const errorMessage: Message = { id: `bot-error-${Date.now()}`, text: errorText, sender: 'bot' };
            setChatHistory(prev => prev.map(chat => {
                if (chat.id === currentChatId) {
                    const filteredMessages = chat.messages.filter(msg => msg.id !== botTypingMessage.id);
                    return { ...chat, messages: [...filteredMessages, errorMessage] };
                }
                return chat;
            }));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNewChat = () => {
        const newChatId = `chat-new-${Date.now()}`;
        const newChatSession: ChatSession = { id: newChatId, title: 'New Chat', messages: [] };
        setChatHistory(prev => [newChatSession, ...prev]);
        setActiveChatId(newChatId);
    };

    const handleDeleteChat = (chatId: string) => {
        const updatedHistory = chatHistory.filter(c => c.id !== chatId);
        setChatHistory(updatedHistory);
        if (activeChatId === chatId) {
            if (updatedHistory.length > 0) {
                setActiveChatId(updatedHistory[0].id);
            } else {
                handleNewChat();
            }
        }
    };
    
    const SearchProviderButton: React.FC<{
      provider: SearchProvider;
      label: string;
      current: SearchProvider;
      onClick: (provider: SearchProvider) => void;
    }> = ({ provider, label, current, onClick }) => (
      <button
        onClick={() => onClick(provider)}
        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
          current === provider
            ? 'bg-red-600 text-white shadow-lg'
            : 'bg-white/5 text-gray-300 hover:bg-white/10'
        }`}
      >
        {label}
      </button>
    );

    const handleSelectChat = (chatId: string) => setActiveChatId(chatId);
    const handleModalToggle = (modalName: keyof typeof modalsOpen, state: boolean) => setModalsOpen(prev => ({ ...prev, [modalName]: state }));

    if (!isGeminiAvailable()) return <ApiKeyPrompt />;

    return (
        <div className="flex h-screen w-screen bg-black text-gray-200 font-sans overflow-hidden">
            <StaticBackground />
            <PetalFall />
            <Sidebar 
                chatHistory={chatHistory} 
                onSelectChat={handleSelectChat} 
                onNewChat={handleNewChat} 
                activeChatId={activeChatId} 
                onVirtualTourClick={() => handleModalToggle('virtualTour', true)} 
                onAttendanceClick={() => handleModalToggle('attendance', true)} 
                onCampusMapClick={() => handleModalToggle('campusMap', true)} 
                onNearbyHangoutsClick={() => handleModalToggle('nearbyHangouts', true)} 
                onTimetableClick={() => handleModalToggle('timetable', true)}
                onIntegrationsClick={() => handleModalToggle('integrations', true)}
                onPlacementDataClick={() => handleModalToggle('placementData', true)}
                onDeleteChat={handleDeleteChat} 
                isHistoryLoading={isHistoryLoading}
            />

            <main className="flex-1 flex flex-col relative z-10">
                <div id="chat-container" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 group animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-red-900/80 flex items-center justify-center flex-shrink-0 shadow-lg p-1"><PesLogo /></div>}
                            <div className={`chat-bubble relative max-w-xl p-3 rounded-xl shadow-lg ${msg.sender === 'user' ? 'bg-red-600/90 text-white' : 'bg-black/40 backdrop-blur-md border border-white/10 text-gray-200'} ${msg.sender === 'bot' && isLargeFont ? 'text-lg' : ''}`}>
                                {msg.isTyping ? <TypingIndicator /> : (
                                    <>
                                        {msg.text && <MarkdownRenderer content={msg.text} />}
                                        {msg.contentType === 'video' && msg.contentUrl && (
                                            <div className="mt-2 max-w-xs mx-auto">
                                                <EmbeddedVideoPlayer url={msg.contentUrl} label={msg.videoLabel} />
                                            </div>
                                        )}
                                        {msg.contentType === 'image' && msg.contentUrl && (
                                            <img src={msg.contentUrl} alt="Image content" className="mt-2 rounded-lg max-w-full h-auto" />
                                        )}
                                    </>
                                )}
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-3 border-t border-gray-700 pt-2">
                                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Sources:</h4>
                                        <div className="flex flex-col gap-1.5 text-xs">
                                            {msg.sources.map((source, index) => (
                                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" key={index} className="text-blue-400 hover:underline truncate">
                                                    {index + 1}. {source.web.title}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                 {msg.sender === 'bot' && !msg.isTyping && msg.text && (
                                    <button 
                                        onClick={() => handleCopyText(msg.text, msg.id)} 
                                        className="absolute -top-2 -right-2 p-1.5 bg-gray-700/80 backdrop-blur-sm rounded-full text-gray-300 hover:bg-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        aria-label="Copy message"
                                    >
                                        {copiedMessageId === msg.id ? (
                                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && !isHistoryLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-28 h-28 mb-4"><PesLogo /></div>
                            <h1 className="text-6xl font-bold text-red-600 pespresso-title mb-2"><AnimatedText text={animatedTitle} /></h1>
                            <p className="text-gray-400">Trained by YapLap</p>
                        </div>
                    )}
                     <style>{`
                        body {
                           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        }
                        .chat-bubble {
                           font-size: 1rem;
                           line-height: 1.6;
                        }
                        .pespresso-title {
                           text-shadow: 0 0 8px rgba(220, 38, 38, 0.6), 0 0 20px rgba(220, 38, 38, 0.4);
                        }
                        @keyframes fade-in-up {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                        
                        .petal-fall-container {
                            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                            overflow: hidden; pointer-events: none; z-index: 1;
                        }
                        .petal {
                            position: absolute;
                            top: -5%;
                            background-color: #DC2626; /* red-600 */
                            border-radius: 50%;
                            box-shadow: 0 0 6px rgba(220, 38, 38, 0.7);
                            user-select: none;
                            opacity: 0;
                            animation-iteration-count: infinite;
                            animation-timing-function: linear;
                        }
                        @keyframes petal-fall-1 {
                            0% { transform: translate(0, 0) rotateZ(10deg); opacity: 1; }
                            25% { transform: translate(20px, 25vh) rotateZ(-10deg); }
                            50% { transform: translate(-10px, 50vh) rotateZ(20deg); }
                            75% { transform: translate(30px, 75vh) rotateZ(-20deg); }
                            100% { transform: translate(10px, 105vh) rotateZ(10deg); opacity: 0; }
                        }
                        @keyframes petal-fall-2 {
                            0% { transform: translate(0, 0) rotateZ(-20deg); opacity: 1; }
                            25% { transform: translate(-30px, 25vh) rotateZ(10deg); }
                            50% { transform: translate(10px, 50vh) rotateZ(-15deg); }
                            75% { transform: translate(-20px, 75vh) rotateZ(25deg); }
                            100% { transform: translate(-5px, 105vh) rotateZ(-10deg); opacity: 0; }
                        }
                        @keyframes petal-fall-3 {
                            0% { transform: translate(0, 0) rotateZ(5deg); opacity: 1; }
                            25% { transform: translate(10px, 25vh) rotateZ(15deg); }
                            50% { transform: translate(-20px, 50vh) rotateZ(-5deg); }
                            75% { transform: translate(5px, 75vh) rotateZ(20deg); }
                            100% { transform: translate(15px, 105vh) rotateZ(0deg); opacity: 0; }
                        }
                    `}</style>
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 md:p-6 bg-transparent">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-2 mb-3 px-2">
                           <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 h-9">
                                    <label className="text-sm font-medium text-gray-400">Persona:</label>
                                    <select value={modelProvider} disabled className="bg-black/40 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-1.5 backdrop-blur-sm appearance-none disabled:opacity-75" aria-label="Current AI Persona">
                                        <option value="pespresso">PESpresso</option>
                                        <option value="grok">Grok</option>
                                        <option value="claude">Claude</option>
                                        <option value="chatgpt">ChatGPT</option>
                                        <option value="qwen">Qwen</option>
                                        <option value="deepseek">DeepSeek</option>
                                    </select>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 h-8 text-center w-64">
                                    {isGenerating ? 'Auto-selecting best model...' : PERSONA_DESCRIPTIONS[modelProvider]}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 h-9">
                                    <label className="text-sm font-medium text-gray-400">Web Search:</label>
                                     <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10 backdrop-blur-sm">
                                        <SearchProviderButton provider="off" label="Off" current={searchProvider} onClick={setSearchProvider} />
                                        <SearchProviderButton provider="google" label="Google" current={searchProvider} onClick={setSearchProvider} />
                                        <SearchProviderButton provider="perplexity" label="Perplexity" current={searchProvider} onClick={setSearchProvider} />
                                    </div>
                                </div>
                                <p className="mt-1 h-8"></p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 h-9">
                                    <label className="text-sm font-medium text-gray-400">Large Font:</label>
                                    <button
                                        onClick={() => setIsLargeFont(!isLargeFont)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${isLargeFont ? 'bg-red-600' : 'bg-gray-700/80'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${isLargeFont ? 'translate-x-6' : 'translate-x-1'}`}
                                        />
                                    </button>
                                </div>
                                <p className="mt-1 h-8"></p>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2 shadow-lg backdrop-blur-md">
                            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask me anything, or use the mic..." className="flex-1 bg-transparent focus:outline-none px-3 text-white placeholder-gray-500" disabled={isGenerating} />
                            {speechRecognitionRef.current && (
                                <button type="button" onClick={handleVoiceInput} disabled={isGenerating} className={`text-gray-400 hover:text-white transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`} aria-label="Use voice input">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
                                </button>
                            )}
                            <button type="submit" disabled={!userInput.trim() || isGenerating} className="bg-red-600 text-white rounded-lg w-10 h-10 flex items-center justify-center disabled:bg-gray-600/50 transition-colors" aria-label="Send">
                                <svg className="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <VirtualTourModal isOpen={modalsOpen.virtualTour} onClose={() => handleModalToggle('virtualTour', false)} />
            <AttendanceCalculator isOpen={modalsOpen.attendance} onClose={() => handleModalToggle('attendance', false)} />
            <CampusMapModal isOpen={modalsOpen.campusMap} onClose={() => handleModalToggle('campusMap', false)} />
            <NearbyHangoutsModal isOpen={modalsOpen.nearbyHangouts} onClose={() => handleModalToggle('nearbyHangouts', false)} />
            <TimetableModal isOpen={modalsOpen.timetable} onClose={() => handleModalToggle('timetable', false)} />
            <IntegrationsModal isOpen={modalsOpen.integrations} onClose={() => handleModalToggle('integrations', false)} />
            <PlacementDataModal isOpen={modalsOpen.placementData} onClose={() => handleModalToggle('placementData', false)} />
        </div>
    );
};

export default App;