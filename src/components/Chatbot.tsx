'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  QUICK_PROMPTS,
  extractActionsFromText,
  ActionLink,
} from '@/lib/shiprecon-assistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actions?: ActionLink[];
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  // Listen for custom open event (e.g. from mobile header help button)
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-shiprecon-chatbot', handleOpenEvent);
    return () => {
      window.removeEventListener('open-shiprecon-chatbot', handleOpenEvent);
    };
  }, []);

  // Keyboard shortcut: Escape to close chat window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (!hasOpened && messages.length === 0) {
      setHasOpened(true);
      // First open greeting
      const greetingMsg: ChatMessage = {
        id: 'greeting-1',
        sender: 'assistant',
        text: "👋 Hi! I'm the ShipRecon Assistant. What would you like help with?",
        timestamp: new Date(),
      };
      setMessages([greetingMsg]);
    }
  };

  const handleSendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      // Basic client-side cooldown check (1 second debounce)
      const now = Date.now();
      if (now - lastSentTime < 1000) {
        return;
      }
      setLastSentTime(now);

      setErrorMessage(null);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInputQuery('');
      setIsLoading(true);

      // Build history payload for server API
      const historyPayload = updatedMessages
        .filter((m) => m.id !== userMsg.id)
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          content: m.text,
        }));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Sorry, I'm having trouble connecting right now. Please try again in a moment.");
        }

        const replyText = data.text || "I'm sorry, I couldn't process your question.";
        const extractedActions = extractActionsFromText(replyText);

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          actions: extractedActions.length > 0 ? extractedActions : undefined,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const errorText =
          err instanceof Error
            ? err.message
            : "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
        setErrorMessage(errorText);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, lastSentTime, messages]
  );

  const renderMessageText = (text: string) => {
    // Render text with clickable markdown-like links [Label](/href)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const label = match[1];
      const href = match[2];

      parts.push(
        <Link
          key={`${href}-${match.index}`}
          href={href}
          onClick={() => {
            // Optional: keep window open or let user navigate
          }}
          className="text-slate-900 font-semibold underline hover:text-slate-700 mx-1"
        >
          {label}
        </Link>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          aria-label="Open ShipRecon Assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center w-6 h-6 bg-slate-800 rounded-full text-xs font-black text-white">
            💬
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-tight">
            ShipRecon Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-assistant-header"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 bg-slate-800 text-white rounded-lg text-xs font-bold border border-slate-700">
                SR
              </span>
              <div>
                <h3 id="chat-assistant-header" className="text-sm font-bold leading-tight">
                  ShipRecon Assistant
                </h3>
                <p className="text-[11px] text-slate-300">How can I help?</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close ShipRecon Assistant"
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              ✕
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs font-normal'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>

                {/* Additional Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, i) => (
                      <Link
                        key={i}
                        href={act.href}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-md text-xs font-semibold transition-colors"
                      >
                        <span>{act.label}</span>
                        <span>→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick Prompts (shown under initial greeting) */}
            {messages.length === 1 && messages[0].id === 'greeting-1' && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Suggested Actions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt.query)}
                      className="text-left px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium transition-colors shadow-2xs"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span>Thinking...</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs leading-normal">
                {errorMessage}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask ShipRecon anything..."
              maxLength={500}
              disabled={isLoading}
              aria-label="Ask ShipRecon Assistant a question"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              aria-label="Send message to ShipRecon Assistant"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
