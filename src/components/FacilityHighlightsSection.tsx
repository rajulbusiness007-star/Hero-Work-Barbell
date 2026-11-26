import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { FACILITY_HIGHLIGHTS } from '../data/gymData';
import { ResilientImage } from './ResilientImage';

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function FacilityHighlightsSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = FACILITY_HIGHLIGHTS.length;
  const activeItem =
    lightboxIndex !== null ? FACILITY_HIGHLIGHTS[lightboxIndex] : null;

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : null));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + total) % total : null
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, total]);

  function handlePrev() {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
  }

  function handleNext() {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
  }

  return (
    <section
      id="facility"
      aria-label="Facility Highlights"
      className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-10 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
            South Congress Tour
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
            Facility Highlights
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Explore our calibrated competition bays, 40-meter conditioning turf, cedar
            infrared sauna, and 39°F cold plunge tubs. Select any space to inspect full-size.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
        >
          {FACILITY_HIGHLIGHTS.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              variants={cardVariants}
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open ${item.title} in fullscreen lightbox`}
              className="group relative text-left bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] rounded-2xl overflow-hidden transition-colors duration-150 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] will-change-transform"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                <ResilientImage
                  src={item.image}
                  alt={item.imageAlt}
                  fallbackLabel={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/35 to-black/15"
                />

                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-[#09090B]/80 backdrop-blur-sm border border-zinc-700/80 text-zinc-200 group-hover:text-[#C8FF00] group-hover:border-[#C8FF00] transition-colors flex items-center justify-center"
                >
                  <Maximize2 className="w-4 h-4" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="font-mono text-xs text-[#C8FF00] tabular-nums mb-1">
                    {item.code} · {item.zone}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-300">
                    {item.spec}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.title} preview`}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-5xl bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Top lightbox controls */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#09090B] border-b border-zinc-800 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-[#C8FF00] tabular-nums truncate">
                    {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')} · {activeItem.zone}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white truncate">
                    {activeItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous facility image"
                    className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-200 hover:text-[#C8FF00] active:scale-[0.96] transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next facility image"
                    className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-200 hover:text-[#C8FF00] active:scale-[0.96] transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    aria-label="Close lightbox"
                    className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-white text-zinc-200 hover:text-white active:scale-[0.96] transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Main zoomed image */}
              <div className="bg-black flex items-center justify-center max-h-[65vh] sm:max-h-[70vh] overflow-hidden">
                <ResilientImage
                  src={activeItem.image}
                  alt={activeItem.imageAlt}
                  eager={true}
                  fallbackLabel={activeItem.title}
                  className="w-full max-h-[65vh] sm:max-h-[70vh] object-contain"
                />
              </div>

              {/* Bottom details bar */}
              <div className="px-4 sm:px-6 py-4 bg-[#09090B] border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  {activeItem.description}
                </p>
                <p className="font-mono text-xs text-[#C8FF00] shrink-0 tabular-nums">
                  {activeItem.spec}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
