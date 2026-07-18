'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Loader2, Minimize2, Maximize2, X, 
  MessageCircle, AlertCircle, WifiOff, Clock, CheckCircle2 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m S-AI. Ask me anything about Indian politics.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Mount state for hydration
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Check backend health with retry
  const checkBackend = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/political/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      setIsBackendAvailable(response.ok);
      if (!response.ok) {
        console.warn('Backend health check failed:', response.status);
      }
    } catch (error) {
      console.warn('Backend health check error:', error);
      setIsBackendAvailable(false);
    }
  }, [API_BASE]);

  // Periodic health check - using requestAnimationFrame to avoid cascading renders
  useEffect(() => {
    if (!mounted) return;
    
    const rafId = requestAnimationFrame(() => {
      checkBackend();
    });
    
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        checkBackend();
      });
    }, 30000);
    
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, checkBackend]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [mounted, messages, typingMessage, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isVisible && inputRef.current && mounted) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, mounted]);

  // Typing animation
  const typeMessage = useCallback((text: string, callback: () => void) => {
    setIsTyping(true);
    setTypingMessage('');
    let index = 0;
    let fullText = '';
    
    const typeNextChar = () => {
      if (index < text.length) {
        fullText += text[index];
        setTypingMessage(fullText);
        index++;
        
        const char = text[index - 1];
        let delay = 12;
        if (['.', '!', '?'].includes(char)) delay = 40;
        else if ([',', ';', ':'].includes(char)) delay = 25;
        else if (char === '\n') delay = 60;
        else if (char === ' ') delay = 8;
        
        setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        callback();
      }
    };
    
    typeNextChar();
  }, []);

  // Send message
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!isBackendAvailable) {
      setError('Backend is not available. Please try again later.');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setTypingMessage('');
    setIsTyping(false);

    try {
      const response = await fetch(`${API_BASE}/api/chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }
      
      const data = await response.json();
      
      if (!data.message) {
        throw new Error('Invalid response from server');
      }
      
      typeMessage(data.message, () => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setTypingMessage('');
        setIsTyping(false);
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response. Please try again.');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting. Please check your connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isBackendAvailable, messages, API_BASE, typeMessage]);

  // Format timestamp
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // Render message content with formatting
  const renderMessage = useCallback((content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return (
          <div key={i} className="flex items-start gap-1.5 text-sm text-zinc-300 tracking-wide">
            <span className="text-red-500 mt-0.5 shrink-0">•</span>
            <span className="wrap-break-word">{trimmed.substring(1).trim()}</span>
          </div>
        );
      }
      
      if (/^\d+\./.test(trimmed)) {
        const num = trimmed.split('.')[0];
        const rest = trimmed.substring(trimmed.indexOf('.') + 1).trim();
        return (
          <div key={i} className="flex items-start gap-1.5 text-sm text-zinc-300 tracking-wide">
            <span className="text-red-500 font-medium shrink-0">{num}.</span>
            <span className="wrap-break-word">{rest}</span>
          </div>
        );
      }
      
      if (trimmed === '') {
        return <div key={i} className="h-1.5" />;
      }
      
      return (
        <p key={i} className="text-sm text-zinc-300 leading-relaxed wrap-break-word tracking-wide">
          {line}
        </p>
      );
    });
  }, []);

  // Status helpers
  const statusColor = useMemo(() => {
    if (isBackendAvailable === null) return 'bg-yellow-400 animate-pulse';
    return isBackendAvailable ? 'bg-emerald-400' : 'bg-red-400';
  }, [isBackendAvailable]);

  const statusText = useMemo(() => {
    if (isBackendAvailable === null) return 'Connecting...';
    return isBackendAvailable ? 'Online' : 'Offline';
  }, [isBackendAvailable]);

  const statusIcon = useMemo(() => {
    if (isBackendAvailable === null) return <Loader2 className="w-2.5 h-2.5 animate-spin" />;
    return isBackendAvailable ? 
      <CheckCircle2 className="w-2.5 h-2.5" /> : 
      <WifiOff className="w-2.5 h-2.5" />;
  }, [isBackendAvailable]);

  // Don't render on server
  if (!mounted) return null;

  // Floating button when chat is closed
  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(true)}
        className="fixed top-18 right-3 sm:right-4 z-40 group"
        aria-label="Open chat with S-AI"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative">
          <motion.div 
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#0a0a0a] border border-red-500/20 shadow-lg shadow-red-500/10 hover:border-red-500/40 transition-all duration-300"
            animate={{ 
              boxShadow: isHovering ? '0 0 30px rgba(220, 38, 38, 0.15)' : '0 0 15px rgba(220, 38, 38, 0.05)'
            }}
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <MessageCircle className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] ${statusColor}`} />
            </div>
            
            <span className="text-xs font-medium text-white whitespace-nowrap tracking-wide">
              Chat with <span className="text-red-500">S-AI</span>
            </span>
            
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 tracking-wide ${
              isBackendAvailable === null ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
              isBackendAvailable ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 
              'text-red-400 bg-red-400/10 border-red-400/20'
            }`}>
              {statusIcon}
              <span className="hidden xs:inline">{statusText}</span>
            </span>
          </motion.div>
        </div>
      </motion.button>
    );
  }

  // Chat window
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        fixed z-50 bg-[#020202] border border-red-500/10 shadow-2xl shadow-black/50
        bottom-0 left-0 right-0 w-full
        md:top-18 md:bottom-auto md:left-auto md:right-4 md:w-105 lg:w-115 md:rounded-2xl
        ${isMinimized ? 'h-13' : 'h-full md:h-150'}
      `}
      role="dialog"
      aria-label="Chat with S-AI"
      ref={chatContainerRef}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header - Neomorphic */}
        <div 
          className="shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-red-500/10 flex items-center justify-between bg-[#020202] cursor-pointer hover:bg-[#0a0a0a] transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="neuomorphic-icon-small w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white tracking-tight">S-AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                <p className="text-[10px] text-zinc-500 tracking-wide">{statusText}</p>
                {isBackendAvailable && (
                  <Clock className="w-2.5 h-2.5 text-zinc-600" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              aria-label="Close chat"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={`${message.role}-${message.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-2.5 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'assistant' 
                          ? 'bg-red-500/15 text-red-500' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl max-w-[88%] sm:max-w-[90%] ${
                          message.role === 'assistant' 
                            ? 'neuomorphic-flat' 
                            : 'bg-red-500 text-white'
                        }`}>
                          <div className="text-sm leading-relaxed wrap-break-word tracking-wide">
                            {renderMessage(message.content)}
                          </div>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-zinc-600 mt-1 px-1 tracking-wide">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing indicator */}
                {isTyping && typingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 sm:gap-3"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                    </div>
                    <div className="neuomorphic-flat inline-block px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl max-w-[85%]">
                      <div className="text-sm text-zinc-200 leading-relaxed wrap-break-word tracking-wide">
                        {renderMessage(typingMessage)}
                        <span className="inline-block w-1 h-4 bg-red-500 ml-0.5 animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Loading indicator */}
                {isLoading && !typingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 sm:gap-3"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
                    </div>
                    <div className="neuomorphic-flat px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl">
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    </div>
                  </motion.div>
                )}
                
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl bg-red-400/10 border border-red-400/20"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 wrap-break-word tracking-wide">{error}</p>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Neomorphic */}
              <form onSubmit={handleSubmit} className="shrink-0 p-3 sm:p-4 border-t border-red-500/10 bg-[#020202]">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isBackendAvailable ? "Ask S-AI about Indian politics..." : "Backend offline..."}
                    className="flex-1 rounded-xl px-3.5 sm:px-4 py-2.5 text-sm bg-[#0a0a0a] border border-white/10 text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 hover:border-white/20 tracking-wide"
                    disabled={isLoading || !isBackendAvailable}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !isBackendAvailable}
                    className="px-3.5 sm:px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:shadow-red-500/40 shrink-0 hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}