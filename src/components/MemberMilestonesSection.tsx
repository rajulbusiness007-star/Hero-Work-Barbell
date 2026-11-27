import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  CalendarCheck2,
  CheckCircle2,
  Dumbbell,
  Flame,
  Lock,
  Medal,
  Trophy,
} from 'lucide-react';
import { MILESTONE_BADGES, type MilestoneBadge } from '../data/gymData';

type BadgeFilter = 'all' | 'unlocked' | 'in-progress';

function BadgeEmblem({
  iconKey,
  unlocked,
}: {
  iconKey: MilestoneBadge['iconKey'];
  unlocked: boolean;
}) {
  const iconClass = `w-6 h-6 transition-colors duration-200 ${
    unlocked ? 'text-[#09090B]' : 'text-zinc-500'
  }`;

  const renderIcon = () => {
    switch (iconKey) {
      case 'workout':
        return <CalendarCheck2 className={iconClass} aria-hidden="true" />;
      case 'pr':
        return <Trophy className={iconClass} aria-hidden="true" />;
      case 'year':
        return <Medal className={iconClass} aria-hidden="true" />;
      case 'recovery':
        return <Flame className={iconClass} aria-hidden="true" />;
      case 'plate':
        return <Dumbbell className={iconClass} aria-hidden="true" />;
      case 'total':
        return <Award className={iconClass} aria-hidden="true" />;
    }
  };

  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        aria-hidden="true"
      >
        <polygon
          points="32,3 57,17 57,47 32,61 7,47 7,17"
          fill={unlocked ? '#C8FF00' : '#18181B'}
          stroke={unlocked ? '#D9FF4D' : '#3F3F46'}
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {renderIcon()}
      </div>
    </div>
  );
}

export function MemberMilestonesSection() {
  const [filter, setFilter] = useState<BadgeFilter>('all');
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() =>
    MILESTONE_BADGES.filter((b) => b.defaultUnlocked).map((b) => b.id)
  );

  function toggleBadgeUnlock(badgeId: string) {
    setUnlockedIds((prev) =>
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    );
  }

  const unlockedCount = unlockedIds.length;
  const totalCount = MILESTONE_BADGES.length;

  const visibleBadges = MILESTONE_BADGES.filter((badge) => {
    const isUnlocked = unlockedIds.includes(badge.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'in-progress') return !isUnlocked;
    return true;
  });

  return (
    <section
      id="milestones"
      aria-label="Member Milestones"
      className="py-16 sm:py-24 bg-[#09090B] border-t border-zinc-900"
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
              Digital Member Profile · {unlockedCount} of {totalCount} Badges Unlocked
            </p>
            <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
              Member Milestones
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Every keycard scan, verified PR, and recovery session earns digital club
              badges tied to real gear and coaching perks on South Congress.
            </p>
          </div>

          {/* Filter controls */}
          <div
            role="tablist"
            aria-label="Filter milestone badges"
            className="inline-flex items-center gap-1 p-1 bg-[#121216] border border-zinc-800 rounded-lg self-start lg:self-end"
          >
            {(
              [
                { id: 'all', label: `All (${totalCount})` },
                { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
                {
                  id: 'in-progress',
                  label: `In Progress (${totalCount - unlockedCount})`,
                },
              ] as const
            ).map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(tab.id)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                    isActive
                      ? 'bg-[#C8FF00] text-[#09090B] font-semibold'
                      : 'text-zinc-400 hover:text-white active:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {visibleBadges.length === 0 ? (
          <div className="p-10 rounded-xl bg-[#121216] border border-zinc-800 text-center">
            <p className="text-base font-semibold text-white">
              {filter === 'unlocked'
                ? 'No badges unlocked yet in this preview.'
                : 'All 6 member milestone badges are unlocked.'}
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="mt-4 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#C8FF00] text-[#09090B] text-sm font-bold cursor-pointer"
            >
              View All Badges
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleBadges.map((badge) => {
                const isUnlocked = unlockedIds.includes(badge.id);
                const displayedProgress = isUnlocked
                  ? badge.targetProgress
                  : Math.min(badge.currentProgress, badge.targetProgress - 1);
                const percent = Math.round(
                  (displayedProgress / badge.targetProgress) * 100
                );

                return (
                  <motion.article
                    key={badge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={`p-6 rounded-xl border flex flex-col justify-between gap-5 transition-colors duration-150 will-change-transform ${
                      isUnlocked
                        ? 'bg-[#14151A] border-[#C8FF00]/60'
                        : 'bg-[#121216] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                  <div>
                    {/* Top row: emblem + metadata + explicit status */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <BadgeEmblem iconKey={badge.iconKey} unlocked={isUnlocked} />

                      <div className="text-right">
                        <span className="block font-mono text-xs text-zinc-500 tabular-nums">
                          {badge.code} · {badge.category}
                        </span>
                        <span
                          className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${
                            isUnlocked ? 'text-[#C8FF00]' : 'text-zinc-400'
                          }`}
                        >
                          {isUnlocked ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Unlocked</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>In Progress</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                      {badge.title}
                    </h3>

                    <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                      {badge.criteria}
                    </p>

                    <p className="mt-3 text-xs text-zinc-300 border-t border-zinc-800/80 pt-3">
                      <span className="text-zinc-500">Club Perk:</span> {badge.perk}
                    </p>
                  </div>

                  {/* Progress + Interactive Toggle */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-1.5">
                        <span className="text-zinc-400">
                          {displayedProgress.toLocaleString()} /{' '}
                          {badge.targetProgress.toLocaleString()} {badge.unitLabel}
                        </span>
                        <span className={isUnlocked ? 'text-[#C8FF00]' : 'text-zinc-400'}>
                          {percent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isUnlocked ? 'bg-[#C8FF00]' : 'bg-zinc-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBadgeUnlock(badge.id)}
                      className={`min-h-[44px] w-full px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] ${
                        isUnlocked
                          ? 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white'
                          : 'bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/60 hover:bg-[#C8FF00] hover:text-[#09090B]'
                      }`}
                    >
                      {isUnlocked ? 'Reset Badge Preview' : 'Simulate Badge Unlock'}
                    </button>
                  </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
