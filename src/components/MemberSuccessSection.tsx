import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MEMBER_TESTIMONIALS } from '../data/gymData';
import { ResilientImage } from './ResilientImage';

export function MemberSuccessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = MEMBER_TESTIMONIALS.length;
  const activeMember = MEMBER_TESTIMONIALS[activeIndex];

  function handlePrev() {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }

  function handleNext() {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }

  function handleJump(index: number) {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }

  return (
    <section
      id="member-success"
      aria-label="Member Success Testimonials"
      className="py-16 sm:py-24 bg-[#09090B] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
              Powerlifting Community
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Member Success
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400">
              Verified meet totals, bar-path breakthroughs, and year-round consistency from
              lifters training on our South Congress floor.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-end">
            <span className="font-mono text-xs text-zinc-400 tabular-nums mr-1">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous member testimonial"
              className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-200 hover:text-[#C8FF00] active:scale-[0.96] transition-[border-color,color,transform] duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next member testimonial"
              className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-200 hover:text-[#C8FF00] active:scale-[0.96] transition-[border-color,color,transform] duration-150 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

        {/* Carousel viewport with fade & slide-up entrance */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden will-change-transform"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeMember.id}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  handleNext();
                } else if (info.offset.x > 50) {
                  handlePrev();
                }
              }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center cursor-grab active:cursor-grabbing"
            >
              <div className="md:col-span-5 lg:col-span-4">
                <div className="relative aspect-square w-full max-w-[340px] mx-auto md:max-w-none rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                  <ResilientImage
                    src={activeMember.image}
                    alt={activeMember.imageAlt}
                    fallbackLabel={activeMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between">
                <div>
                  <Quote
                    className="w-7 h-7 text-[#C8FF00]/80 mb-4"
                    aria-hidden="true"
                  />

                  <blockquote className="text-lg sm:text-2xl text-zinc-100 font-medium leading-snug sm:leading-relaxed text-balance">
                    &ldquo;{activeMember.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800/90 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                      {activeMember.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                      {activeMember.division}
                      <span aria-hidden="true" className="mx-2 text-zinc-600">
                        ·
                      </span>
                      {activeMember.memberSince}
                    </p>
                  </div>

                  <div className="sm:text-right tabular-nums">
                    <p className="font-mono text-sm sm:text-base font-semibold text-[#C8FF00]">
                      {activeMember.milestoneMetric}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {activeMember.timeframe} · Coached by {activeMember.coachWorkedWith}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>

        {/* Thumb-friendly member selector strip */}
        <motion.div
          role="tablist"
          aria-label="Select member story"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 will-change-transform"
        >
          {MEMBER_TESTIMONIALS.map((member, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={member.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleJump(index)}
                className={`min-h-[44px] px-3.5 py-2.5 rounded-lg border text-left transition-colors duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                  isSelected
                    ? 'bg-[#14151A] border-[#C8FF00] text-white'
                    : 'bg-[#121216] border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="block text-xs sm:text-sm font-semibold truncate">
                  {member.name}
                </span>
                <span className="block font-mono text-[11px] text-zinc-500 truncate tabular-nums">
                  {member.division}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
