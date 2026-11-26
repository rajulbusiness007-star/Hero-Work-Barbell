import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, User } from 'lucide-react';
import {
  CLASS_SESSIONS,
  type ClassCategory,
  type GymClassSession,
} from '../data/gymData';
import { ResilientImage } from './ResilientImage';

interface ScheduleSectionProps {
  reservedIds: string[];
  onToggleReserve: (session: GymClassSession) => void;
}

const CATEGORIES: ClassCategory[] = ['All', 'Strength', 'Conditioning', 'Recovery'];

function IntensityBars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-end gap-0.5 h-3.5" aria-hidden="true">
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-xs transition-colors ${
            bar === 1 ? 'h-1.5' : bar === 2 ? 'h-2.5' : 'h-3.5'
          } ${bar <= level ? 'bg-[#C8FF00]' : 'bg-zinc-700'}`}
        />
      ))}
    </span>
  );
}

export function ScheduleSection({
  reservedIds,
  onToggleReserve,
}: ScheduleSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ClassCategory>('All');

  const filteredSessions =
    selectedCategory === 'All'
      ? CLASS_SESSIONS
      : CLASS_SESSIONS.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="schedule"
      className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
              Daily Coach-Led Sessions
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Today&apos;s Class Schedule
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400">
              Swipe through live blocks on mobile or filter by training focus. Members book
              any slot directly with zero drop-in fees.
            </p>
          </div>

          {/* Interactive segmented filter buttons */}
          <div
            role="tablist"
            aria-label="Filter classes by training focus"
            className="inline-flex items-center gap-1 p-1 bg-[#121216] border border-zinc-800 rounded-lg self-start overflow-x-auto max-w-full no-scrollbar"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                    isActive
                      ? 'bg-[#C8FF00] text-[#09090B] font-semibold'
                      : 'text-zinc-400 hover:text-white active:bg-zinc-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: horizontal swipeable snap rail; Tablet/Desktop: responsive grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 no-scrollbar md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
          {filteredSessions.map((session, index) => {
            const isReserved = reservedIds.includes(session.id);
            const remainingSpots = isReserved
              ? Math.max(0, session.spotsLeft - 1)
              : session.spotsLeft;

            return (
              <motion.article
                key={session.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="snap-start shrink-0 w-[82vw] max-w-[330px] md:w-auto md:max-w-none bg-[#121216] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors duration-150 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                  <ResilientImage
                    src={session.image}
                    alt={session.imageAlt}
                    fallbackLabel={session.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/25"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 font-mono tabular-nums mb-2">
                      <span className="inline-flex items-center gap-1.5 text-white font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#C8FF00]" aria-hidden="true" />
                        {session.time}
                      </span>
                      <span>
                        {session.duration} · {remainingSpots} left
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
                      {session.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 mb-3">
                      <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">{session.trainer}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 tabular-nums">
                      <IntensityBars level={session.intensityLevel} />
                      <span>{session.intensityLabel}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleReserve(session)}
                    className={`min-h-[44px] w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                      isReserved
                        ? 'bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/60 hover:bg-[#C8FF00]/25'
                        : 'bg-zinc-900 text-white border border-zinc-700 hover:border-[#C8FF00] hover:text-[#C8FF00]'
                    }`}
                  >
                    {isReserved ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Spot Reserved</span>
                      </>
                    ) : (
                      <span>Reserve Spot</span>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-zinc-500 md:hidden">
          Swipe left or right to preview all daily sessions.
        </p>
      </div>
    </section>
  );
}
