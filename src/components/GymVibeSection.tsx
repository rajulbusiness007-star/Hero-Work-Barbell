import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Copy,
  Disc3,
  ExternalLink,
  Headphones,
  ListMusic,
  Volume2,
} from 'lucide-react';
import { GYM_PLAYLISTS } from '../data/gymData';

type PlayerView = 'spotify' | 'tracklist';

export function GymVibeSection() {
  const [selectedMixId, setSelectedMixId] = useState<string>(GYM_PLAYLISTS[0].id);
  const [viewMode, setViewMode] = useState<PlayerView>('spotify');
  const [copiedLink, setCopiedLink] = useState(false);

  const activeMix =
    GYM_PLAYLISTS.find((mix) => mix.id === selectedMixId) ?? GYM_PLAYLISTS[0];

  async function handleCopyPlaylistLink() {
    try {
      await navigator.clipboard.writeText(activeMix.spotifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(false);
    }
  }

  return (
    <section
      id="gym-vibe"
      aria-label="Gym Vibe Official Lifting Playlists"
      className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
              Floor Acoustics &amp; Official Audio
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Gym Vibe
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Queue the exact Ironwork Barbell heavy lifting mix played on our South
              Congress floor speakers—built for top singles, sled intervals, and recovery
              resets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            <button
              type="button"
              onClick={handleCopyPlaylistLink}
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-[#121216] border border-zinc-800 hover:border-zinc-600 text-xs sm:text-sm font-semibold text-zinc-200 inline-flex items-center gap-2 transition-colors active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#C8FF00]" aria-hidden="true" />
                  <span>Playlist Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy Mix Link</span>
                </>
              )}
            </button>

            <a
              href={activeMix.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#C8FF00] text-[#09090B] hover:bg-[#D9FF4D] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-[background-color,transform] active:scale-[0.98] whitespace-nowrap"
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              <span>Open in Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch will-change-transform"
        >
          {/* Left Column: Curated Mix Switcher */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {GYM_PLAYLISTS.map((mix) => {
              const isSelected = mix.id === activeMix.id;
              return (
                <button
                  key={mix.id}
                  type="button"
                  onClick={() => setSelectedMixId(mix.id)}
                  className={`p-5 rounded-xl border text-left transition-colors duration-150 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                    isSelected
                      ? 'bg-[#14151A] border-[#C8FF00]'
                      : 'bg-[#121216] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-mono text-xs text-zinc-500 tabular-nums">
                      {mix.code} · {mix.focus}
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isSelected ? 'text-[#C8FF00] font-semibold' : 'text-zinc-400'
                      }`}
                    >
                      {mix.bpmRange}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                    {mix.name}
                  </h3>

                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                    {mix.description}
                  </p>

                  <p className="mt-3 pt-3 border-t border-zinc-800/80 font-mono text-xs text-zinc-400 tabular-nums">
                    {mix.tracks.length} Featured Cuts · {mix.totalDuration}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Spotify Embed + Tracklist Switcher */}
          <div className="lg:col-span-7 bg-[#121216] border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#C8FF00]/15 border border-[#C8FF00]/40 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-[#C8FF00]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold uppercase tracking-tight text-white truncate">
                    {activeMix.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-400 tabular-nums truncate">
                    {activeMix.bpmRange} · {activeMix.totalDuration}
                  </p>
                </div>
              </div>

              {/* Player / Tracklist segmented toggle */}
              <div
                role="tablist"
                aria-label="Playlist display mode"
                className="inline-flex items-center gap-1 p-1 bg-[#09090B] border border-zinc-800 rounded-lg self-start sm:self-auto"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'spotify'}
                  onClick={() => setViewMode('spotify')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    viewMode === 'spotify'
                      ? 'bg-[#C8FF00] text-[#09090B]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Spotify Embed</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'tracklist'}
                  onClick={() => setViewMode('tracklist')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    viewMode === 'tracklist'
                      ? 'bg-[#C8FF00] text-[#09090B]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ListMusic className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tracklist</span>
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {viewMode === 'spotify' ? (
                <motion.div
                  key={`spotify-${activeMix.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between gap-4"
                >
                  <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#09090B]">
                    <iframe
                      key={activeMix.spotifyPlaylistId}
                      title={`Spotify player for ${activeMix.name}`}
                      src={`https://open.spotify.com/embed/playlist/${activeMix.spotifyPlaylistId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="352"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="w-full block border-0"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2">
                    <span>
                      Prefer the native mobile app? Tap &ldquo;Open in Spotify&rdquo; above
                      to save this rotation offline.
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode('tracklist')}
                      className="text-zinc-300 hover:text-[#C8FF00] underline underline-offset-4 cursor-pointer"
                    >
                      View floor tracklist
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`tracklist-${activeMix.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between gap-4"
                >
                  <ul className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-xl bg-[#09090B] px-4">
                    {activeMix.tracks.map((track, idx) => (
                      <li
                        key={track.title}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="font-mono text-xs text-zinc-500 tabular-nums w-5 shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {track.title}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {track.artist}
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs text-zinc-400 tabular-nums shrink-0">
                          <span className="text-[#C8FF00]">{track.bpm} BPM</span>
                          <span aria-hidden="true" className="mx-2 text-zinc-700">
                            ·
                          </span>
                          <span>{track.duration}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Updated weekly by South Congress floor coaches</span>
                    <a
                      href={activeMix.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8FF00] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <span>Stream full mix</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
