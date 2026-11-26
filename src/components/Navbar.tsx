import { GYM_INFO } from '../data/gymData';

interface NavbarProps {
  onBookTrial: () => void;
}

const NAV_LINKS = [
  { label: 'Why Us', href: '#why-us' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Success', href: '#member-success' },
  { label: 'Macros', href: '#macro-calculator' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Location', href: '#gym-location' },
];

export function Navbar({ onBookTrial }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-[#09090B]/90 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 lg:gap-8">
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#top"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] rounded-sm"
          >
            {GYM_INFO.brand}
          </a>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121216] border border-zinc-800 font-mono text-[10px] tracking-wider uppercase text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] beacon-dot" aria-hidden="true" />
            24/7 Open
          </span>
        </div>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-300 hover:text-[#C8FF00] transition-colors duration-150 whitespace-nowrap shrink-0 py-2 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onBookTrial}
            className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-[#C8FF00] text-[#09090B] font-bold text-xs sm:text-sm tracking-wide rounded-lg hover:bg-[#D9FF4D] hover:shadow-[0_6px_24px_rgba(200,255,0,0.22)] active:scale-[0.97] transition-[background-color,box-shadow,transform] duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
          >
            Book Free Trial
          </button>
        </div>
      </div>
    </header>
  );
}
