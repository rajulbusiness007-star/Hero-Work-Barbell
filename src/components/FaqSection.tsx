import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { FAQ_ITEMS } from '../data/gymData';

interface FaqSectionProps {
  onBookTrial: () => void;
}

export function FaqSection({ onBookTrial }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  function toggleItem(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-16 sm:py-24 bg-[#09090B] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Header Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
              Member Logistics
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
              Everything you need to know about 24/7 keycard entry, trial pass access,
              barbell equipment rules, and flexible billing.
            </p>

            <div className="mt-7">
              <button
                type="button"
                onClick={onBookTrial}
                className="min-h-[48px] px-6 py-3 bg-[#121216] border border-zinc-700 hover:border-[#C8FF00] text-white hover:text-[#C8FF00] font-semibold text-sm rounded-lg active:scale-[0.98] transition-[border-color,color,transform] duration-150 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
              >
                <span>Claim Your 3-Day Free Pass</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Right Accordion Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-3"
          >
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const triggerId = `faq-trigger-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-colors duration-150 ${
                    isOpen
                      ? 'bg-[#14151A] border-[#C8FF00]/60'
                      : 'bg-[#121216] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full min-h-[60px] px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] rounded-xl"
                    >
                      <div className="min-w-0">
                        <span className="block font-mono text-[11px] text-zinc-500 tabular-nums mb-1">
                          {String(index + 1).padStart(2, '0')} · {item.category}
                        </span>
                        <span className="block text-base sm:text-lg font-semibold text-white leading-snug">
                          {item.question}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`w-9 h-9 rounded-lg border shrink-0 flex items-center justify-center transition-colors duration-150 ${
                          isOpen
                            ? 'bg-[#C8FF00] text-[#09090B] border-[#C8FF00]'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-zinc-800/70">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
