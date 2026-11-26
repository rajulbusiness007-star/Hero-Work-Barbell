import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { GYM_INFO, type PricingTier } from '../data/gymData';

interface TrialBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: PricingTier | null;
  billing: 'monthly' | 'yearly';
}

export function TrialBookingModal({
  isOpen,
  onClose,
  selectedTier,
  billing,
}: TrialBookingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [focus, setFocus] = useState('Powerlifting & Strength');
  const [error, setError] = useState('');
  const [passCode, setPassCode] = useState<string | null>(null);

  function resetAndClose() {
    setError('');
    setPassCode(null);
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a phone number for keycard SMS setup.');
      return;
    }

    setError('');
    const code = `IW-${Math.floor(1000 + Math.random() * 9000)}`;
    setPassCode(code);
  }

  const tierPrice = selectedTier
    ? billing === 'yearly'
      ? selectedTier.yearlyMonthlyPrice
      : selectedTier.monthlyPrice
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trial-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full sm:max-w-lg bg-[#121216] border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Mobile sheet handle */}
            <div
              aria-hidden="true"
              className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden"
            />

            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-medium text-[#C8FF00] mb-1">
                  {selectedTier
                    ? `${selectedTier.name} · $${tierPrice}/mo`
                    : `3-Day Free Trial Pass · ${GYM_INFO.city}`}
                </p>
                <h2
                  id="trial-modal-title"
                  className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white"
                >
                  {passCode ? 'Your Pass Is Active' : 'Claim Your Free Pass'}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close modal"
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {passCode ? (
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-[#C8FF00] text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    <span>Confirmed for {name.trim()}</span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    Show code{' '}
                    <span className="font-mono font-bold text-white tabular-nums">
                      {passCode}
                    </span>{' '}
                    at the South Congress front desk between 6:00 AM and 9:00 PM to activate
                    your smartphone 24/7 access.
                  </p>
                  {selectedTier && (
                    <p className="text-xs text-zinc-400 pt-1">
                      Selected tier: {selectedTier.name} (${tierPrice}/mo billed {billing}).
                      Zero charge during your 3-day trial.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="min-h-[48px] w-full bg-[#C8FF00] text-[#09090B] font-bold text-sm rounded-lg hover:bg-[#D9FF4D] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Back to {GYM_INFO.fullName}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="trial-name"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="trial-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Taylor"
                    className="min-h-[44px] w-full px-3.5 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="trial-email"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="trial-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="min-h-[44px] w-full px-3.5 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="trial-phone"
                      className="block text-xs font-medium text-zinc-300 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="trial-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(512) 555-0142"
                      className="min-h-[44px] w-full px-3.5 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="trial-focus"
                    className="block text-xs font-medium text-zinc-300 mb-1.5"
                  >
                    Primary Training Focus
                  </label>
                  <select
                    id="trial-focus"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="min-h-[44px] w-full px-3.5 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                  >
                    <option value="Powerlifting & Strength">Powerlifting &amp; Strength</option>
                    <option value="Turf Conditioning & Metcon">Turf Conditioning &amp; Metcon</option>
                    <option value="Olympic Lifting & Mobility">Olympic Lifting &amp; Mobility</option>
                    <option value="24/7 Open Gym + Recovery">24/7 Open Gym + Recovery</option>
                  </select>
                </div>

                {error && (
                  <p role="alert" className="text-xs text-rose-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="min-h-[48px] w-full mt-2 bg-[#C8FF00] text-[#09090B] font-bold text-sm rounded-lg hover:bg-[#D9FF4D] active:scale-[0.98] transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  {selectedTier ? 'Start 3-Day Free Trial' : 'Generate Free Pass'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
