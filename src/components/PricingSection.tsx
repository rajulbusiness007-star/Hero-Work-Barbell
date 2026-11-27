import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { PRICING_TIERS, type PricingTier } from '../data/gymData';

interface PricingSectionProps {
  onSelectTier: (tier: PricingTier, billing: 'monthly' | 'yearly') => void;
}

export function PricingSection({ onSelectTier }: PricingSectionProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const isYearly = billing === 'yearly';

  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
              Transparent Memberships
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Lock In Your Training Tier
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400">
              No hidden initiation fees or surprise annual maintenance charges. Start every
              membership with a free 3-day floor trial.
            </p>
          </div>

          {/* Billing toggle switch */}
          <div className="flex items-center gap-3 self-start bg-[#121216] border border-zinc-800 rounded-xl px-4 py-2.5">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`min-h-[40px] px-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                !isYearly ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={isYearly}
              aria-label="Toggle between monthly and yearly billing"
              onClick={() => setBilling(isYearly ? 'monthly' : 'yearly')}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                isYearly ? 'bg-[#C8FF00]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-[#09090B] shadow-sm transition-transform duration-200 ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`min-h-[40px] px-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 ${
                isYearly ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Yearly</span>
              <span className="text-xs font-mono font-semibold text-[#C8FF00]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {PRICING_TIERS.map((tier, index) => {
            const displayPrice = isYearly ? tier.yearlyMonthlyPrice : tier.monthlyPrice;
            const annualSavings = (tier.monthlyPrice - tier.yearlyMonthlyPrice) * 12;

            return (
              <motion.article
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative p-6 sm:p-8 rounded-xl border flex flex-col justify-between transition-colors duration-150 ${
                  tier.isBestValue
                    ? 'bg-[#14151A] border-[#C8FF00] shadow-lg shadow-[#C8FF00]/5'
                    : 'bg-[#121216] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tier.isBestValue && (
                  <div className="absolute -top-3.5 right-6 bg-[#C8FF00] text-[#09090B] px-3.5 py-1 rounded-sm font-display text-xs font-bold uppercase tracking-wider">
                    Best Value
                  </div>
                )}

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-400 min-h-[40px]">
                    {tier.subtitle}
                  </p>

                  <div className="mt-6 pb-6 border-b border-zinc-800/90">
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="font-display text-5xl font-bold text-white">
                        ${displayPrice}
                      </span>
                      <span className="text-sm text-zinc-400">/ month</span>
                    </div>
                    <p className="mt-1.5 text-xs font-mono text-zinc-400 tabular-nums">
                      {isYearly
                        ? `Billed annually ($${displayPrice * 12}/yr · Save $${annualSavings})`
                        : 'Billed month-to-month · Cancel anytime'}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3.5">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-zinc-200 leading-snug"
                      >
                        <Check
                          className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTier(tier, billing)}
                  className={`mt-8 min-h-[48px] w-full px-5 py-3 rounded-lg font-bold text-sm tracking-wide transition-[background-color,border-color,transform] duration-150 active:scale-[0.98] whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                    tier.isBestValue
                      ? 'bg-[#C8FF00] text-[#09090B] hover:bg-[#D9FF4D]'
                      : 'bg-zinc-900 text-white border border-zinc-700 hover:border-[#C8FF00] hover:text-[#C8FF00]'
                  }`}
                >
                  {tier.ctaLabel}
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
