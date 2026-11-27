import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { GYM_INFO, HERO_MEDIA } from '../data/gymData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onClaimPass: () => void;
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ onClaimPass }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] flex items-end pb-10 pt-20 sm:pb-14 sm:pt-24 overflow-hidden bg-[#09090B]"
    >
      {/* Full-bleed high-priority background hero image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.04, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="w-full h-full will-change-transform"
        >
          <ResilientImage
            src={HERO_MEDIA.image}
            alt={HERO_MEDIA.alt}
            eager={true}
            fetchPriority="high"
            width={1376}
            height={768}
            fallbackLabel={GYM_INFO.fullName}
            className="w-full h-full object-cover object-[center_18%] sm:object-center"
          />
        </motion.div>

        {/* Ambient radial ember + volt atmosphere bridging athlete rim-light with Obsidian canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgba(255,107,26,0.10),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_85%,rgba(200,255,0,0.08),transparent_65%)]"
        />

        {/* Measured directional scrims ensuring >= 4.5:1 text contrast while keeping athlete focal center clear */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/55 to-[#09090B]/65"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09090B]/90 via-[#09090B]/20 to-[#09090B]/75"
        />
      </div>

      {/* Flanking ghost-outline display typography framing the athlete without crossing the face */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:flex items-center justify-between max-w-7xl mx-auto px-8 absolute inset-x-0 top-14 xl:top-16 z-[1] select-none"
      >
        <motion.span
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="font-display font-bold uppercase tracking-[0.06em] text-[clamp(4.5rem,7.2vw,7.5rem)] leading-none text-outline-volt"
        >
          IRONWORK
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
          className="font-display font-bold uppercase tracking-[0.06em] text-[clamp(4.5rem,7.2vw,7.5rem)] leading-none text-outline-volt"
        >
          BARBELL
        </motion.span>
      </div>

      {/* Foreground split anchor: Left Command Column + Right Telemetry HUD */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          {/* Left: Status Badge, Display Headline, Manifesto, Lead Copy & CTAs */}
          <div className="lg:col-span-7 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121216]/90 backdrop-blur-md border border-zinc-800 mb-4 sm:mb-5"
            >
              <span
                className="w-2 h-2 rounded-full bg-[#C8FF00] beacon-dot shrink-0"
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] sm:text-xs font-medium tracking-[0.1em] uppercase text-[#C8FF00]">
                24/7 Powerlifting &amp; Performance · {GYM_INFO.city}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.05, ease: EASE_OUT_EXPO }}
              className="font-display font-bold uppercase tracking-tight text-white leading-[0.94] text-[clamp(3.15rem,7.5vw,5.4rem)] text-balance mb-4"
            >
              Crush Your Limits
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3 mb-4"
            >
              <span
                aria-hidden="true"
                className="w-8 sm:w-10 h-[3px] bg-[#C8FF00] rounded-full shrink-0"
              />
              <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#C8FF00]">
                {HERO_MEDIA.manifesto}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.22, ease: EASE_OUT_EXPO }}
              className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl mb-7 sm:mb-8"
            >
              Join {GYM_INFO.fullName} today. Calibrated Eleiko &amp; Rogue steel, high-output
              40m turf conditioning, and an infrared sauna + 39°F cold plunge suite engineered
              for lifters who refuse to coast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.3, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={onClaimPass}
                className="min-h-[50px] px-7 py-3.5 bg-[#C8FF00] text-[#09090B] font-bold text-sm sm:text-base rounded-lg hover:bg-[#D9FF4D] hover:shadow-[0_10px_30px_rgba(200,255,0,0.25)] active:scale-[0.98] transition-[background-color,box-shadow,transform] duration-150 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
              >
                <span>Claim Your Free Pass</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="#schedule"
                className="min-h-[50px] px-6 py-3.5 border border-zinc-700/90 bg-[#121216]/85 backdrop-blur-md text-zinc-100 font-semibold text-sm sm:text-base rounded-lg hover:border-[#C8FF00]/70 hover:text-[#C8FF00] hover:bg-[#14151A] active:scale-[0.98] transition-[border-color,color,background-color,transform] duration-150 inline-flex items-center justify-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
              >
                Browse Class Schedule
              </a>
            </motion.div>

            {/* Compact mobile/tablet proof strip (visible below lg) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="mt-8 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-300 tabular-nums lg:hidden"
            >
              <span>42 Calibrated Racks</span>
              <span aria-hidden="true" className="text-zinc-600">
                ·
              </span>
              <span>24/7 Keycard Entry</span>
              <span aria-hidden="true" className="text-zinc-600">
                ·
              </span>
              <span>South Congress, Austin</span>
            </motion.div>
          </div>

          {/* Right: Desktop Telemetry HUD Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.26, ease: EASE_OUT_EXPO }}
            className="hidden lg:flex lg:col-span-5 flex-col items-end gap-4"
          >
            <div className="w-full max-w-[540px] rounded-2xl bg-[#121216]/82 backdrop-blur-xl border border-zinc-800/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <p className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-zinc-400">
                  South Congress Floor Specs · Open 24/7
                </p>
                <span className="font-mono text-[11px] font-semibold text-[#FF6B1A] uppercase tracking-wider">
                  Live Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {HERO_MEDIA.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl bg-[#09090B]/80 border border-zinc-800/90 px-3.5 py-3.5 hover:border-[#C8FF00]/50 transition-colors"
                  >
                    <p className="font-mono text-xl xl:text-2xl font-bold text-[#C8FF00] tabular-nums tracking-tight whitespace-nowrap">
                      {metric.value}
                    </p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.08em] uppercase text-zinc-300">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="#why-us"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-zinc-400 hover:text-[#C8FF00] transition-colors pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] rounded-sm"
            >
              <span>Explore Floor &amp; Coaching</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
