import { motion } from 'motion/react';
import { Award, Clock, Flame, Users } from 'lucide-react';
import { WHY_US_PILLARS, type WhyUsPillar } from '../data/gymData';

function PillarIcon({ name }: { name: WhyUsPillar['iconName'] }) {
  const iconClass = 'w-6 h-6 text-[#C8FF00]';
  switch (name) {
    case 'award':
      return <Award className={iconClass} aria-hidden="true" />;
    case 'clock':
      return <Clock className={iconClass} aria-hidden="true" />;
    case 'flame':
      return <Flame className={iconClass} aria-hidden="true" />;
    case 'users':
      return <Users className={iconClass} aria-hidden="true" />;
  }
}

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function WhyUsSection() {
  return (
    <section
      id="why-us"
      className="py-16 sm:py-24 bg-[#09090B] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-10 sm:mb-14"
        >
          <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
            Built for Serious Progress
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
            Why Lifters Choose Ironwork
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Every square foot of our South Congress floor is built around measurable strength,
            zero-wait equipment density, and deliberate recovery.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {WHY_US_PILLARS.map((pillar) => (
            <motion.article
              key={pillar.id}
              variants={cardVariants}
              className="group p-6 bg-[#121216] border border-zinc-800 rounded-xl hover:border-[#C8FF00]/60 active:scale-[0.99] transition-[border-color,transform] duration-150 flex flex-col justify-between will-change-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#C8FF00]/40 transition-colors">
                    <PillarIcon name={pillar.iconName} />
                  </div>
                  <span className="font-mono text-xs text-zinc-500 tabular-nums">
                    {pillar.number}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-1.5">
                  {pillar.title}
                </h3>

                <p className="text-xs font-medium text-[#C8FF00] tabular-nums mb-3">
                  {pillar.metric}
                </p>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
