'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CVData } from '@/types/cv';
import { sampleCVData } from '@/data/sampleCVData';
import dynamic from 'next/dynamic';
import { FiSend, FiDownload, FiSun, FiMoon, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

// Dynamically import CV preview to avoid SSR issues (named export)
const CVPreview = dynamic(
  () => import('@/components/CVPreview').then(mod => mod.CVPreview), 
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-400">Loading preview...</div>
      </div>
    )
  }
);

// Message types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  actions?: CVAction[];
}

// Actions the agent can take on the CV
interface CVAction {
  type: 'update_field' | 'update_template' | 'update_style' | 'add_section' | 'remove_section';
  field?: string;
  value?: any;
  description: string;
}

// Available templates
const TEMPLATES = ['modern', 'classic', 'minimal', 'creative', 'executive', 'tech'];

// Available accent colors
const ACCENT_COLORS = [
  { name: 'blue', value: '#3b82f6' },
  { name: 'green', value: '#10b981' },
  { name: 'purple', value: '#8b5cf6' },
  { name: 'red', value: '#ef4444' },
  { name: 'orange', value: '#f97316' },
  { name: 'teal', value: '#14b8a6' },
  { name: 'pink', value: '#ec4899' },
  { name: 'slate', value: '#64748b' },
];

export default function ChatBuilderPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // CV State
  const [cvData, setCvData] = useState<CVData>({
    template: 'modern',
    layout: {
      accentColor: '#3b82f6',
      showIcons: true,
      photoPosition: 'right',
    }
  });
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `# Welcome to CV Chat Builder! 🚀

I'm your AI assistant, and I'll help you create a professional CV through conversation.

**Here's how it works:**
- Just tell me about yourself, and I'll build your CV in real-time
- Ask me to change the template, colors, or layout anytime
- I can help write compelling content for any section


**Try saying:**
- "My name is [your name] and I'm a [your profession]"
- "I worked at [company] as a [role] for [duration]"
- "Change the template to something more modern"
- "Make the accent color green"

What would you like to start with?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process user input through AI agents
  const processUserInput = async (input: string) => {
    setIsProcessing(true);
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);
    
    try {
      // Call our CV chat agent API
      const response = await fetch('/api/cv-chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          cvData,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process request');
      }
      
      const result = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      // Apply CV updates if any
      if (result.cvUpdates && Object.keys(result.cvUpdates).length > 0) {
        setCvData(prev => {
          const merged = deepMerge(prev, result.cvUpdates);
          // Only update if data actually changed (compare signatures to prevent flashing)
          const prevSig = JSON.stringify(prev);
          const mergedSig = JSON.stringify(merged);
          if (prevSig === mergedSig) {
            return prev; // Return same reference if nothing changed
          }
          return merged;
        });
        console.log('[ChatBuilder] CV updated:', result.cvUpdates);
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        actions: result.actions,
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('[ChatBuilder] Error:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      // Fallback to local processing
      const fallbackResponse = processLocalFallback(input);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (fallbackResponse.cvUpdates) {
        setCvData(prev => {
          const merged = deepMerge(prev, fallbackResponse.cvUpdates!);
          // Only update if data actually changed (compare signatures to prevent flashing)
          const prevSig = JSON.stringify(prev);
          const mergedSig = JSON.stringify(merged);
          if (prevSig === mergedSig) {
            return prev; // Return same reference if nothing changed
          }
          return merged;
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Local fallback processing (when API unavailable)
  const processLocalFallback = (input: string): { response: string; cvUpdates?: Partial<CVData> } => {
    const inputLower = input.toLowerCase();
    
    // Template changes
    const templateMatch = inputLower.match(/template.*?(modern|classic|minimal|creative|executive|tech)/i) ||
                          inputLower.match(/(modern|classic|minimal|creative|executive|tech).*?template/i);
    if (templateMatch) {
      const template = templateMatch[1].toLowerCase();
      return {
        response: `✨ Done! I've switched to the **${template}** template. The preview is updating now.\n\nWhat do you think? Want me to adjust anything else?`,
        cvUpdates: { template },
      };
    }
    
    // Color changes
    const colorMatch = inputLower.match(/color.*?(blue|green|purple|red|orange|teal|pink|slate)/i) ||
                       inputLower.match(/(blue|green|purple|red|orange|teal|pink|slate).*?color/i) ||
                       inputLower.match(/make it (blue|green|purple|red|orange|teal|pink|slate)/i);
    if (colorMatch) {
      const colorName = colorMatch[1].toLowerCase();
      const color = ACCENT_COLORS.find(c => c.name === colorName);
      if (color) {
        return {
          response: `🎨 Perfect! I've changed the accent color to **${colorName}**. Looking fresh!\n\nAnything else you'd like to customize?`,
          cvUpdates: { layout: { ...cvData.layout, accentColor: color.value } },
        };
      }
    }
    
    // Name extraction
    const nameMatch = input.match(/(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i) ||
                      input.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)$/);
    if (nameMatch) {
      const name = nameMatch[1];
      return {
        response: `Nice to meet you, **${name}**! 👋 I've added your name to the CV.\n\nWhat's your current job title or profession?`,
        cvUpdates: { fullName: name },
      };
    }
    
    // Title/profession extraction
    const titleMatch = input.match(/(?:i'm a|i am a|work as a?|my (?:job|role|title) is)\s+(.+?)(?:\.|$)/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      return {
        response: `Great! I've set your title as **${title}**. 💼\n\nWould you like to add a professional summary, or tell me about your work experience?`,
        cvUpdates: { title },
      };
    }
    
    // Load sample data
    if (inputLower.includes('sample') || inputLower.includes('example') || inputLower.includes('demo')) {
      return {
        response: `📋 I've loaded a sample CV to show you what's possible! Feel free to:\n\n- Replace the content with your own information\n- Change the template or colors\n- Add or remove sections\n\nJust tell me what you'd like to change!`,
        cvUpdates: sampleCVData,
      };
    }
    
    // Help
    if (inputLower.includes('help') || inputLower === '?') {
      return {
        response: `## How I Can Help 🤖

**Content:**
- "My name is [name]" - Set your name
- "I work as a [title]" - Set your job title  
- "Add experience at [company] as [role]" - Add work experience
- "Write a summary about..." - Generate professional summary

**Styling:**
- "Change template to [modern/classic/minimal/creative]"
- "Make the color [blue/green/purple/red/teal]"
- "Show/hide photo"

**Actions:**
- "Load sample" - See an example CV
- "Clear all" - Start fresh
- "Download" - Get your CV as PDF

What would you like to do?`,
      };
    }
    
    // Default response
    return {
      response: `I understand you want to work on your CV. Here are some things I can help with:\n\n- **Personal Info**: Tell me your name, title, contact details\n- **Experience**: Describe your work history\n- **Education**: Share your educational background\n- **Skills**: List your technical and soft skills\n- **Styling**: Change templates, colors, layout\n\nTry saying "load sample" to see an example, or just start telling me about yourself!`,
    };
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    processUserInput(inputValue.trim());
    setInputValue('');
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Download CV as PDF using print dialog
  const handleDownload = () => {
    // Store CV data for print page
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvDataForPrint', JSON.stringify(cvData));
      
      // Open print page in new window
      const printWindow = window.open('/print-cv', '_blank');
      
      if (printWindow) {
        toast.success('Opening print preview...', { id: 'pdf' });
      } else {
        toast.error('Please allow popups to download PDF', { id: 'pdf' });
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <Toaster position="top-center" />
      
      {/* Minimal Header */}
      <header className={`h-14 border-b flex items-center justify-between px-4 ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            CV Chat Builder
          </h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiDownload size={16} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className={`flex-1 flex flex-col ${isPreviewCollapsed ? 'w-full' : 'w-1/2'} transition-all duration-300`}>
          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
          }`}>
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isDarkMode={isDarkMode}
              />
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input Area */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell me about yourself, or ask me to change something..."
                  rows={1}
                  className={`w-full px-4 py-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-transparent'
                  } border`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={isProcessing}
                />
              </div>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isProcessing}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  inputValue.trim() && !isProcessing
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FiSend size={20} />
              </button>
            </form>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Load sample', 'Modern template', 'Classic template', 'Blue color', 'Green color'].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInputValue(action);
                    inputRef.current?.focus();
                  }}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Preview Toggle Button */}
        <button
          onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-l-lg shadow-lg transition-all ${
            isDarkMode 
              ? 'bg-gray-800 text-gray-400 hover:text-white' 
              : 'bg-white text-gray-500 hover:text-gray-900'
          } ${isPreviewCollapsed ? 'right-0' : 'right-[50%]'}`}
          style={{ transform: `translateY(-50%) ${isPreviewCollapsed ? '' : 'translateX(50%)'}` }}
        >
          {isPreviewCollapsed ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
        
        {/* CV Preview Panel */}
        <div 
          className={`transition-all duration-300 overflow-hidden ${
            isPreviewCollapsed ? 'w-0' : 'w-1/2'
          } ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        >
          <div className="h-full overflow-auto p-6" ref={previewRef}>
            <div className="bg-white rounded-lg shadow-2xl mx-auto" style={{ 
              width: '210mm', 
              minHeight: '297mm',
              transform: 'scale(0.7)',
              transformOrigin: 'top center',
            }}>
              <CVPreview 
                data={cvData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, isDarkMode }: { message: Message; isDarkMode: boolean }) {
  const isUser = message.role === 'user';
  const isTyping = message.isTyping;
  
  if (isTyping) {
    return (
      <div className="flex justify-start">
        <div className={`px-4 py-3 rounded-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : isDarkMode 
            ? 'bg-gray-800 text-gray-100' 
            : 'bg-white text-gray-900 shadow-sm'
      }`}>
        <div className={`prose prose-sm ${
          isUser 
            ? 'prose-invert' 
            : isDarkMode 
              ? 'prose-invert' 
              : ''
        } max-w-none`}>
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  );
}

// Parse and render markdown-like content
function MessageContent({ content }: { content: string }) {
  // Simple markdown rendering
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('## ')) {
          return <h3 key={idx} className="text-lg font-semibold mt-2">{line.slice(3)}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={idx} className="text-xl font-bold mt-2">{line.slice(2)}</h2>;
        }
        
        // Bold text
        const boldRegex = /\*\*(.+?)\*\*/g;
        const withBold = line.replace(boldRegex, '<strong>$1</strong>');
        
        // Bullet points
        if (line.startsWith('- ')) {
          return (
            <div key={idx} className="flex gap-2 ml-2">
              <span>•</span>
              <span dangerouslySetInnerHTML={{ __html: withBold.slice(2) }} />
            </div>
          );
        }
        
        // Empty lines
        if (!line.trim()) {
          return <div key={idx} className="h-2" />;
        }
        
        // Regular text
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: withBold }} />
        );
      })}
    </div>
  );
}

// Deep merge utility
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' && 
        source[key] !== null && 
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        result[key] !== null
      ) {
        result[key] = deepMerge(result[key], source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
}

