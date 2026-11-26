import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Dumbbell,
  MessageSquare,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';

type ChatMode = 'coach' | 'concierge';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const INITIAL_MESSAGES: Record<ChatMode, ChatMessage> = {
  coach: {
    id: 'welcome-coach',
    role: 'model',
    text: "I'm your Ironwork Strength Coach. Ask about squat/bench/deadlift programming, RPE progression, warm-ups, or dialing in your lifting macros.",
  },
  concierge: {
    id: 'welcome-concierge',
    role: 'model',
    text: "Welcome to Ironwork Barbell on South Congress. Ask me about 24/7 keycard access, today's class schedule, recovery zone hours, or your 3-day free trial.",
  },
};

const STARTER_PROMPTS: Record<ChatMode, string[]> = {
  coach: [
    'Build me a 4-day powerlifting split',
    'How should I warm up for a heavy deadlift single?',
    'Best protein & carb timing before 6 AM training?',
  ],
  concierge: [
    "What's included in the 3-day free trial?",
    'How does 24/7 after-hours access work?',
    'Compare Monthly Open Gym vs Annual All-Access',
  ],
};

export function GymChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('coach');
  const [threads, setThreads] = useState<Record<ChatMode, ChatMessage[]>>({
    coach: [INITIAL_MESSAGES.coach],
    concierge: [INITIAL_MESSAGES.concierge],
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const activeMessages = threads[mode];

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  async function sendMessage(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextThread = [...threads[mode], userMsg];
    setThreads((prev) => ({ ...prev, [mode]: nextThread }));
    setInput('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Exclude static welcome greeting if it's the very first turn, or send full conversation context
      const apiMessages = nextThread
        .filter((msg) => !msg.id.startsWith('welcome-'))
        .map((msg) => ({ role: msg.role, text: msg.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: apiMessages,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        setErrorMsg(
          data.error || 'Could not complete that request. Please try again.'
        );
        return;
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
      };

      setThreads((prev) => ({
        ...prev,
        [mode]: [...prev[mode], modelMsg],
      }));
    } catch {
      setErrorMsg('Network connection interrupted. Please try sending again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  function handleResetThread() {
    setThreads((prev) => ({
      ...prev,
      [mode]: [INITIAL_MESSAGES[mode]],
    }));
    setErrorMsg('');
  }

  return (
    <>
      {/* Compact floating toggle button (56px keeps combined mobile sticky height <= 15%) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Ironwork Assistant chat"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-[#C8FF00] text-[#09090B] shadow-xl shadow-black/50 hover:bg-[#D9FF4D] active:scale-[0.95] transition-[background-color,transform] duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
        >
          <MessageSquare className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-modal="false"
            aria-label="Ironwork Assistant Chat"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 bottom-3 top-16 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[410px] sm:h-[580px] z-50 bg-[#121216] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-[#09090B] border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#C8FF00]/15 border border-[#C8FF00]/40 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#C8FF00]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-base font-bold uppercase tracking-wide text-white truncate">
                    Ironwork Assistant
                  </h2>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {mode === 'coach'
                      ? 'Strength & Programming Coach'
                      : '24/7 Membership Concierge'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleResetThread}
                  aria-label="Reset conversation"
                  title="New chat"
                  className="min-h-[40px] min-w-[40px] rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="min-h-[40px] min-w-[40px] rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Role Selector Tabs */}
            <div className="px-4 py-2.5 bg-[#0D0D10] border-b border-zinc-800/80 shrink-0">
              <div
                role="tablist"
                aria-label="Select assistant role"
                className="grid grid-cols-2 gap-1 p-1 bg-[#09090B] border border-zinc-800 rounded-lg"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'coach'}
                  onClick={() => {
                    setMode('coach');
                    setErrorMsg('');
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    mode === 'coach'
                      ? 'bg-[#C8FF00] text-[#09090B]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Strength Coach
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'concierge'}
                  onClick={() => {
                    setMode('concierge');
                    setErrorMsg('');
                  }}
                  className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    mode === 'concierge'
                      ? 'bg-[#C8FF00] text-[#09090B]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Gym Concierge
                </button>
              </div>
            </div>

            {/* Scrollable Conversation Thread */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5"
            >
              {activeMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#C8FF00] text-[#09090B] font-medium'
                          : 'bg-[#09090B] border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Quick starter prompts on fresh thread */}
              {activeMessages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-2">
                  <p className="text-[11px] font-medium text-zinc-500">
                    Quick prompts
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {STARTER_PROMPTS[mode].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="min-h-[40px] px-3 py-2 text-left text-xs text-zinc-300 hover:text-[#C8FF00] bg-[#09090B] border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#09090B] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-400">
                    Thinking...
                  </div>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl bg-rose-950/40 border border-rose-800/60 px-3.5 py-2.5 text-xs text-rose-200"
                >
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-[#09090B] border-t border-zinc-800 flex items-end gap-2 shrink-0"
            >
              <label htmlFor="gym-chat-input" className="sr-only">
                Message Ironwork Assistant
              </label>
              <textarea
                ref={inputRef}
                id="gym-chat-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={
                  mode === 'coach'
                    ? 'Ask about lifts, RPE, or macros...'
                    : 'Ask about hours, classes, or free pass...'
                }
                disabled={isLoading}
                className="min-h-[44px] max-h-28 flex-1 resize-none px-3.5 py-2.5 bg-[#121216] border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                aria-label="Send message"
                className="min-h-[44px] min-w-[44px] rounded-lg bg-[#C8FF00] text-[#09090B] hover:bg-[#D9FF4D] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96] transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
