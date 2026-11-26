import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  Instagram,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

export function Footer() {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      setErrorMsg('Enter a valid email address to receive weekly lift notes.');
      return;
    }

    setErrorMsg('');
    setSubscribed(true);
    setEmail('');
  }

  return (
    <footer
      id="footer"
      className="bg-[#09090B] border-t border-zinc-800 pt-16 pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Interactive South Congress Map Embed */}
          <div className="lg:col-span-5">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#111216]">
              {/* Crisp architectural dark vector street grid of South Congress, Austin TX */}
              <svg
                viewBox="0 0 480 280"
                className="w-full h-full object-cover"
                role="img"
                aria-label="Map showing Ironwork Barbell at 1420 S Congress Ave, Austin, TX"
              >
                <rect width="480" height="280" fill="#101115" />
                {/* Minor city grid */}
                <g stroke="#1E2028" strokeWidth="1.5">
                  <line x1="0" y1="55" x2="480" y2="55" />
                  <line x1="0" y1="115" x2="480" y2="115" />
                  <line x1="0" y1="175" x2="480" y2="175" />
                  <line x1="0" y1="230" x2="480" y2="230" />
                  <line x1="75" y1="0" x2="75" y2="280" />
                  <line x1="155" y1="0" x2="155" y2="280" />
                  <line x1="335" y1="0" x2="335" y2="280" />
                  <line x1="415" y1="0" x2="415" y2="280" />
                </g>
                {/* Major corridors: S Congress Ave & W Monroe St */}
                <g stroke="#2B2E3A" strokeWidth="7" strokeLinecap="round">
                  <line x1="255" y1="0" x2="215" y2="280" />
                  <line x1="0" y1="145" x2="480" y2="128" />
                </g>
                <g stroke="#3A3F4F" strokeWidth="1.5" strokeDasharray="6 6">
                  <line x1="255" y1="0" x2="215" y2="280" />
                </g>
                {/* Neighborhood blocks */}
                <rect x="90" y="70" width="52" height="35" rx="3" fill="#16181F" />
                <rect x="268" y="68" width="54" height="40" rx="3" fill="#16181F" />
                <rect x="250" y="156" width="68" height="48" rx="3" fill="#16181F" />
                {/* Street labels */}
                <text
                  x="262"
                  y="38"
                  fill="#71717A"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  S CONGRESS AVE
                </text>
                <text
                  x="30"
                  y="136"
                  fill="#71717A"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  W MONROE ST
                </text>
                {/* Location pin */}
                <circle cx="235" cy="136" r="24" fill="#C8FF00" fillOpacity="0.14" />
                <circle cx="235" cy="136" r="9" fill="#C8FF00" />
                <circle cx="235" cy="136" r="3.5" fill="#09090B" />
              </svg>

              {/* Floating address bar inside map */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#09090B]/92 backdrop-blur-md border border-zinc-800 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {GYM_INFO.fullName} · South Congress
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {GYM_INFO.addressLine1}, {GYM_INFO.addressLine2}
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=1420+S+Congress+Ave+Austin+TX+78704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:border-[#C8FF00] text-xs font-medium text-zinc-100 hover:text-[#C8FF00] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Address & Opening Hours */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-3">
                Visit The Gym
              </h3>
              <div className="space-y-2.5 text-sm text-zinc-400">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    {GYM_INFO.addressLine1}
                    <br />
                    {GYM_INFO.addressLine2}
                  </span>
                </p>
                <p className="flex items-center gap-2.5 tabular-nums">
                  <Phone className="w-4 h-4 text-[#C8FF00] shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+15125550194"
                    className="hover:text-white transition-colors"
                  >
                    {GYM_INFO.phone}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-3">
                Opening Hours
              </h3>
              <div className="space-y-2 text-sm text-zinc-400 tabular-nums">
                <p className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-zinc-200 font-medium block">
                      {GYM_INFO.hoursMember}
                    </strong>
                    {GYM_INFO.hoursStaffed}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Email Signup & Social Links */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-2">
                Weekly Training Notes
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Get free Sunday open-barbell invites, strength cycles, and recovery workshops
                in Austin.
              </p>

              <form onSubmit={handleSubscribe} noValidate className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                      if (subscribed) setSubscribed(false);
                    }}
                    placeholder="you@domain.com"
                    className="min-h-[44px] flex-1 px-4 py-2.5 bg-[#121216] border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C8FF00]"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 bg-[#C8FF00] text-[#09090B] font-bold text-sm rounded-lg hover:bg-[#D9FF4D] active:scale-[0.98] transition-[background-color,transform] duration-150 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Join List</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs text-rose-400">
                    {errorMsg}
                  </p>
                )}

                {subscribed && (
                  <p
                    role="status"
                    className="text-xs text-[#C8FF00] inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Subscribed. Watch your inbox for Sunday Barbell Club invites.</span>
                  </p>
                )}
              </form>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2.5">
                Connect with {GYM_INFO.fullName}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ironwork Barbell on Instagram"
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-300 hover:text-[#C8FF00] transition-colors flex items-center justify-center"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ironwork Barbell on YouTube"
                  className="min-h-[44px] min-w-[44px] rounded-lg bg-[#121216] border border-zinc-800 hover:border-[#C8FF00] text-zinc-300 hover:text-[#C8FF00] transition-colors flex items-center justify-center"
                >
                  <Youtube className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} {GYM_INFO.fullName}. All rights reserved.
          </p>
          <p>
            {GYM_INFO.addressLine1} · {GYM_INFO.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
