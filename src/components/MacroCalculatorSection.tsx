import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Check, Copy, Flame } from 'lucide-react';

type WeightUnit = 'lbs' | 'kg';
type LiftingGoal = 'surplus' | 'maintain' | 'cut';

interface ActivityOption {
  id: string;
  label: string;
  detail: string;
  multiplier: number;
}

const ACTIVITY_LEVELS: ActivityOption[] = [
  {
    id: 'foundations',
    label: '3 Days / Wk',
    detail: 'Foundations & Technique',
    multiplier: 1.4,
  },
  {
    id: 'standard',
    label: '4 Days / Wk',
    detail: 'SBD Conjugate / Volume',
    multiplier: 1.55,
  },
  {
    id: 'peak',
    label: '5–6 Days / Wk',
    detail: 'Peak Meet Prep + Turf',
    multiplier: 1.725,
  },
  {
    id: 'two-a-day',
    label: '2x Daily',
    detail: 'Competitive Heavy Block',
    multiplier: 1.88,
  },
];

const GOAL_OPTIONS: {
  id: LiftingGoal;
  label: string;
  delta: number;
  note: string;
}[] = [
  {
    id: 'surplus',
    label: 'Strength Gain',
    delta: 300,
    note: '+300 kcal surplus',
  },
  {
    id: 'maintain',
    label: 'Hold Class',
    delta: 0,
    note: 'Weight-class maintenance',
  },
  {
    id: 'cut',
    label: 'Meet Cut',
    delta: -350,
    note: '-350 kcal controlled cut',
  },
];

interface MacroCalculatorSectionProps {
  onBookConsult: () => void;
}

export function MacroCalculatorSection({
  onBookConsult,
}: MacroCalculatorSectionProps) {
  const [unit, setUnit] = useState<WeightUnit>('lbs');
  const [weightInput, setWeightInput] = useState<string>('185');
  const [ageInput, setAgeInput] = useState<string>('28');
  const [activityId, setActivityId] = useState<string>('standard');
  const [goal, setGoal] = useState<LiftingGoal>('surplus');
  const [copied, setCopied] = useState(false);

  function handleUnitSwitch(nextUnit: WeightUnit) {
    if (nextUnit === unit) return;
    const numericWeight = parseFloat(weightInput);
    if (!Number.isNaN(numericWeight) && numericWeight > 0) {
      const converted =
        nextUnit === 'kg'
          ? Math.round(numericWeight / 2.20462)
          : Math.round(numericWeight * 2.20462);
      setWeightInput(String(converted));
    }
    setUnit(nextUnit);
  }

  const results = useMemo(() => {
    const rawWeight = parseFloat(weightInput);
    const rawAge = parseFloat(ageInput);

    const safeWeight =
      Number.isNaN(rawWeight) || rawWeight <= 0
        ? unit === 'lbs'
          ? 185
          : 84
        : Math.min(Math.max(rawWeight, unit === 'lbs' ? 85 : 38), unit === 'lbs' ? 420 : 190);

    const safeAge =
      Number.isNaN(rawAge) || rawAge <= 0
        ? 28
        : Math.min(Math.max(rawAge, 16), 85);

    const weightKg = unit === 'lbs' ? safeWeight * 0.453592 : safeWeight;
    const weightLbs = unit === 'lbs' ? safeWeight : safeWeight * 2.20462;

    // Athletic strength-adjusted resting energy estimate (using 175cm reference stature)
    const bmr = 10 * weightKg + 6.25 * 175 - 5 * safeAge - 40;
    const activity =
      ACTIVITY_LEVELS.find((item) => item.id === activityId) ?? ACTIVITY_LEVELS[1];
    const goalMeta = GOAL_OPTIONS.find((item) => item.id === goal) ?? GOAL_OPTIONS[0];

    const maintenanceCalories = bmr * activity.multiplier;
    const targetCalories = Math.max(
      1400,
      Math.round((maintenanceCalories + goalMeta.delta) / 10) * 10
    );

    // Powerlifting macro distribution:
    // Protein: ~1.05g/lb during cut, ~1.0g/lb maintain, ~0.95g/lb surplus
    const proteinPerLb = goal === 'cut' ? 1.08 : goal === 'maintain' ? 1.0 : 0.95;
    const proteinGrams = Math.round(weightLbs * proteinPerLb);
    const proteinCalories = proteinGrams * 4;

    // Fat: ~25% of target calories (floor 0.32g/lb for hormonal health)
    const fatCalories = Math.max(
      Math.round(targetCalories * 0.25),
      Math.round(weightLbs * 0.32 * 9)
    );
    const fatGrams = Math.round(fatCalories / 9);

    // Carbohydrates: remaining calories to fuel heavy barbell output & glycogen
    const remainingCarbCalories = Math.max(
      240,
      targetCalories - proteinCalories - fatGrams * 9
    );
    const carbGrams = Math.round(remainingCarbCalories / 4);

    const totalMacroCalories =
      proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;

    const proteinPct = Math.round(((proteinGrams * 4) / totalMacroCalories) * 100);
    const carbPct = Math.round(((carbGrams * 4) / totalMacroCalories) * 100);
    const fatPct = Math.max(1, 100 - proteinPct - carbPct);

    return {
      isDefaultFallback:
        Number.isNaN(rawWeight) ||
        rawWeight <= 0 ||
        Number.isNaN(rawAge) ||
        rawAge <= 0,
      targetCalories,
      maintenanceCalories: Math.round(maintenanceCalories / 10) * 10,
      proteinGrams,
      carbGrams,
      fatGrams,
      proteinPct,
      carbPct,
      fatPct,
      goalNote: goalMeta.note,
    };
  }, [weightInput, ageInput, unit, activityId, goal]);

  async function handleCopyTargets() {
    const summary = `Ironwork Powerlifting Targets: ${results.targetCalories} kcal/day · Protein ${results.proteinGrams}g (${results.proteinPct}%) · Carbs ${results.carbGrams}g (${results.carbPct}%) · Fats ${results.fatGrams}g (${results.fatPct}%)`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="macro-calculator"
      aria-label="Powerlifting Macro Calculator"
      className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-10 sm:mb-12"
        >
          <p className="text-xs sm:text-sm font-medium text-[#C8FF00] mb-2">
            Performance Fueling
          </p>
          <h2 className="font-display font-bold uppercase tracking-tight text-white text-3xl sm:text-5xl text-balance">
            Powerlifting Macro Calculator
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Dial in your daily caloric intake, protein floor, and training carbohydrates
            for squats, pulls, and meet-day prep.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch will-change-transform"
        >
          {/* Left Column: Calculator Controls */}
          <div className="lg:col-span-7 bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {/* Weight + Unit Selector */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <label
                    htmlFor="macro-weight"
                    className="text-xs sm:text-sm font-semibold text-zinc-200"
                  >
                    Body Weight ({unit})
                  </label>

                  <div
                    role="group"
                    aria-label="Weight unit"
                    className="inline-flex p-0.5 bg-[#09090B] border border-zinc-800 rounded-lg"
                  >
                    {(['lbs', 'kg'] as const).map((unitOption) => (
                      <button
                        key={unitOption}
                        type="button"
                        onClick={() => handleUnitSwitch(unitOption)}
                        className={`min-h-[36px] px-3 text-xs font-mono uppercase rounded-md transition-colors cursor-pointer ${
                          unit === unitOption
                            ? 'bg-[#C8FF00] text-[#09090B] font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {unitOption}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 relative">
                    <input
                      id="macro-weight"
                      type="number"
                      inputMode="decimal"
                      min={unit === 'lbs' ? 85 : 38}
                      max={unit === 'lbs' ? 420 : 190}
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="min-h-[48px] w-full px-4 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg font-mono text-base font-semibold text-white tabular-nums focus:outline-none focus:border-[#C8FF00]"
                    />
                  </div>
                  <div className="sm:col-span-8 flex items-center">
                    <input
                      type="range"
                      aria-label="Adjust body weight slider"
                      min={unit === 'lbs' ? 95 : 43}
                      max={unit === 'lbs' ? 350 : 160}
                      value={
                        Number.isNaN(parseFloat(weightInput))
                          ? unit === 'lbs'
                            ? 185
                            : 84
                          : Math.min(
                              Math.max(parseFloat(weightInput), unit === 'lbs' ? 95 : 43),
                              unit === 'lbs' ? 350 : 160
                            )
                      }
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full accent-[#C8FF00] h-2 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Age & Goal Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="macro-age"
                    className="block text-xs sm:text-sm font-semibold text-zinc-200 mb-2"
                  >
                    Age (Years)
                  </label>
                  <input
                    id="macro-age"
                    type="number"
                    inputMode="numeric"
                    min={16}
                    max={85}
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="min-h-[48px] w-full px-4 py-2.5 bg-[#09090B] border border-zinc-700 rounded-lg font-mono text-base font-semibold text-white tabular-nums focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>

                <div className="sm:col-span-8">
                  <span className="block text-xs sm:text-sm font-semibold text-zinc-200 mb-2">
                    Training Phase
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {GOAL_OPTIONS.map((option) => {
                      const isActive = goal === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setGoal(option.id)}
                          className={`min-h-[48px] px-2.5 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap truncate ${
                            isActive
                              ? 'bg-[#C8FF00] text-[#09090B] border-[#C8FF00]'
                              : 'bg-[#09090B] text-zinc-300 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Activity Level Selector */}
              <div>
                <span className="block text-xs sm:text-sm font-semibold text-zinc-200 mb-2.5">
                  Weekly Barbell &amp; Conditioning Volume
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ACTIVITY_LEVELS.map((level) => {
                    const isSelected = activityId === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setActivityId(level.id)}
                        className={`min-h-[56px] p-3 rounded-xl border text-left transition-colors active:scale-[0.98] cursor-pointer ${
                          isSelected
                            ? 'bg-[#14151A] border-[#C8FF00] text-white'
                            : 'bg-[#09090B] border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                        }`}
                      >
                        <span className="block font-mono text-xs font-semibold text-[#C8FF00] tabular-nums">
                          {level.label}
                        </span>
                        <span className="block text-xs mt-0.5 leading-snug text-zinc-300">
                          {level.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {results.isDefaultFallback && (
              <p className="text-xs text-zinc-400">
                Enter valid positive weight and age values above to personalize your numbers.
              </p>
            )}
          </div>

          {/* Right Column: Live Caloric & Macro Targets */}
          <div className="lg:col-span-5 bg-[#121216] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-[#C8FF00]">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                  Daily Performance Target
                </span>
                <span className="font-mono text-xs text-zinc-400 tabular-nums">
                  {results.goalNote}
                </span>
              </div>

              <div className="pb-6 border-b border-zinc-800">
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="font-display text-5xl sm:text-6xl font-bold text-white tracking-tight">
                    {results.targetCalories.toLocaleString()}
                  </span>
                  <span className="font-mono text-sm text-zinc-400">kcal / day</span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-400 tabular-nums">
                  Estimated maintenance: {results.maintenanceCalories.toLocaleString()} kcal
                </p>
              </div>

              {/* Visual Macro Split Bar */}
              <div className="mt-5">
                <div
                  className="h-2.5 w-full rounded-full overflow-hidden flex bg-zinc-900"
                  aria-hidden="true"
                >
                  <div
                    className="bg-[#C8FF00] transition-all duration-300"
                    style={{ width: `${results.proteinPct}%` }}
                  />
                  <div
                    className="bg-zinc-200 transition-all duration-300"
                    style={{ width: `${results.carbPct}%` }}
                  />
                  <div
                    className="bg-zinc-600 transition-all duration-300"
                    style={{ width: `${results.fatPct}%` }}
                  />
                </div>
              </div>

              {/* 3 Macro Breakdown Rows */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between py-2.5 border-b border-zinc-800/70 tabular-nums">
                  <div>
                    <p className="text-sm font-semibold text-white">Protein</p>
                    <p className="text-xs text-zinc-400">Strength recovery &amp; tissue repair</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-[#C8FF00]">
                      {results.proteinGrams}g
                    </p>
                    <p className="font-mono text-xs text-zinc-400">{results.proteinPct}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 border-b border-zinc-800/70 tabular-nums">
                  <div>
                    <p className="text-sm font-semibold text-white">Carbohydrates</p>
                    <p className="text-xs text-zinc-400">Barbell output &amp; muscle glycogen</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-white">
                      {results.carbGrams}g
                    </p>
                    <p className="font-mono text-xs text-zinc-400">{results.carbPct}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 tabular-nums">
                  <div>
                    <p className="text-sm font-semibold text-white">Fats</p>
                    <p className="text-xs text-zinc-400">Joint resilience &amp; hormone floor</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-zinc-200">
                      {results.fatGrams}g
                    </p>
                    <p className="font-mono text-xs text-zinc-400">{results.fatPct}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyTargets}
                className="min-h-[48px] flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-100 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#C8FF00]" aria-hidden="true" />
                    <span>Copied Targets</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy Macros</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBookConsult}
                className="min-h-[48px] flex-1 px-4 py-3 rounded-lg bg-[#C8FF00] text-[#09090B] hover:bg-[#D9FF4D] text-sm font-bold inline-flex items-center justify-center gap-2 transition-[background-color,transform] active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                <Flame className="w-4 h-4" aria-hidden="true" />
                <span>Dial In With Coach</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
