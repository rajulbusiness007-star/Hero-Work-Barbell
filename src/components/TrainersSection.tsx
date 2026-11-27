import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { TRAINER_PROFILES } from '../data/gymData';
import { ResilientImage } from './ResilientImage';

export function TrainersSection() {
  return (
    <section
      id="trainers"
      className="py-16 sm:py-24 bg-[#09090B] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
            Coaching Roster
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
            Meet Your Performance Team
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Every coach on our roster holds national strength or conditioning credentials and
            actively mentors members on the floor daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TRAINER_PROFILES.map((trainer, index) => (
            <motion.article
              key={trainer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group p-6 sm:p-7 bg-[#121216] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors duration-150 flex flex-col items-center text-center"
            >
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-5">
                <ResilientImage
                  src={trainer.image}
                  alt={trainer.imageAlt}
                  width={1024}
                  height={1024}
                  fallbackLabel={trainer.name}
                  className="w-full h-full rounded-full object-cover ring-2 ring-zinc-800 group-hover:ring-[#C8FF00] transition-all duration-200"
                />
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                {trainer.name}
              </h3>

              <p className="mt-1 text-xs sm:text-sm font-semibold text-[#C8FF00]">
                {trainer.specialty}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {trainer.role} · {trainer.credentials}
              </p>

              <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-xs">
                {trainer.bio}
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 w-full flex items-center justify-center">
                <a
                  href={trainer.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${trainer.name} on Instagram (${trainer.instagramHandle})`}
                  className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-zinc-300 hover:text-[#C8FF00] hover:bg-zinc-900 active:scale-[0.97] transition-[color,background-color,transform] duration-150 inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00]"
                >
                  <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{trainer.instagramHandle}</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
