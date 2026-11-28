export type ClassCategory = 'All' | 'Strength' | 'Conditioning' | 'Recovery';

export interface WhyUsPillar {
  id: string;
  number: string;
  title: string;
  metric: string;
  description: string;
  iconName: 'award' | 'clock' | 'flame' | 'users';
}

export interface GymClassSession {
  id: string;
  name: string;
  category: Exclude<ClassCategory, 'All'>;
  time: string;
  duration: string;
  trainer: string;
  intensityLabel: string;
  intensityLevel: 1 | 2 | 3;
  spotsLeft: number;
  image: string;
  imageAlt: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  credentials: string;
  bio: string;
  instagramHandle: string;
  instagramUrl: string;
  image: string;
  imageAlt: string;
}

export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  isBestValue?: boolean;
  ctaLabel: string;
  features: string[];
}

export interface MemberTestimonial {
  id: string;
  name: string;
  division: string;
  memberSince: string;
  quote: string;
  milestoneMetric: string;
  timeframe: string;
  coachWorkedWith: string;
  image: string;
  imageAlt: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface MilestoneBadge {
  id: string;
  code: string;
  title: string;
  category: string;
  criteria: string;
  perk: string;
  unitLabel: string;
  currentProgress: number;
  targetProgress: number;
  defaultUnlocked: boolean;
  iconKey: 'workout' | 'year' | 'pr' | 'total' | 'recovery' | 'plate';
}

export interface GymPlaylistTrack {
  title: string;
  artist: string;
  bpm: number;
  duration: string;
}

export interface GymPlaylistMix {
  id: string;
  code: string;
  name: string;
  focus: string;
  bpmRange: string;
  totalDuration: string;
  spotifyPlaylistId: string;
  spotifyUrl: string;
  description: string;
  tracks: GymPlaylistTrack[];
}

export interface FacilityHighlight {
  id: string;
  code: string;
  zone: string;
  title: string;
  spec: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const HERO_MEDIA = {
  image: '/images/hero_beast_power_clean.jpg',
  alt: 'Muscular athlete gripping a loaded steel barbell under dramatic ember rim lighting inside Ironwork Barbell in Austin, Texas',
  manifesto: "If it's not heavy, it's not changing you.",
  metrics: [
    { value: '42', label: 'Calibrated Racks' },
    { value: '12', label: 'Oak Platforms' },
    { value: '185° / 39°', label: 'Contrast Suite' },
  ],
};

export const WHY_US_PILLARS: WhyUsPillar[] = [
  {
    id: 'trainers',
    number: '01',
    title: 'Expert Trainers',
    metric: 'CSCS & USAPL Certified',
    description:
      'Floor coaches who actively compete and coach biomechanics—correcting bar path, bracing, and programming on every lift.',
    iconName: 'award',
  },
  {
    id: 'access',
    number: '02',
    title: '24/7 Access',
    metric: '365 Days · Keycard Entry',
    description:
      'Train at 4:30 AM or midnight without waiting for a rack. Smartphone biometric access across 42 calibrated competition stations.',
    iconName: 'clock',
  },
  {
    id: 'recovery',
    number: '03',
    title: 'Recovery Zone',
    metric: '185°F Sauna · 39°F Plunge',
    description:
      'Full-spectrum cedar infrared saunas, dual cold plunge tubs, and Normatec compression lounges built directly into your training floor.',
    iconName: 'flame',
  },
  {
    id: 'community',
    number: '04',
    title: 'Community',
    metric: '1,400+ Active Lifters',
    description:
      'Zero ego, loud music, and reliable spotters. Monthly Friday Night Deadlifts and seasonal in-house meets keep everyone pushing.',
    iconName: 'users',
  },
];

export const CLASS_SESSIONS: GymClassSession[] = [
  {
    id: 'barbell-club',
    name: 'Competition Barbell Club',
    category: 'Strength',
    time: '06:00 AM',
    duration: '75 min',
    trainer: 'Marcus Vance',
    intensityLabel: 'Max Effort · 9/10',
    intensityLevel: 3,
    spotsLeft: 4,
    image: '/images/class_powerlifting_1795573052215.jpg',
    imageAlt: 'Lifters squatting with calibrated plates on steel racks',
  },
  {
    id: 'turf-engine',
    name: 'Metcon Turf Engine',
    category: 'Conditioning',
    time: '07:30 AM',
    duration: '50 min',
    trainer: 'Elena Rostova',
    intensityLabel: 'High Output · 8/10',
    intensityLevel: 3,
    spotsLeft: 6,
    image: '/images/class_conditioning_1795573053565.jpg',
    imageAlt: 'Athlete pushing a heavy weighted prowler sled across black gym turf',
  },
  {
    id: 'olympic-mechanics',
    name: 'Olympic Lift & Mobility',
    category: 'Strength',
    time: '12:00 PM',
    duration: '60 min',
    trainer: 'Devon Hale',
    intensityLabel: 'Technical · 7/10',
    intensityLevel: 2,
    spotsLeft: 5,
    image: '/images/class_powerlifting_1795573052215.jpg',
    imageAlt: 'Barbell technique and squat mechanics training session',
  },
  {
    id: 'contrast-reset',
    name: 'Contrast Recovery Protocol',
    category: 'Recovery',
    time: '05:30 PM',
    duration: '45 min',
    trainer: 'Devon Hale',
    intensityLabel: 'Restorative · 4/10',
    intensityLevel: 1,
    spotsLeft: 3,
    image: '/images/class_recovery_1795573053940.jpg',
    imageAlt: 'Cedar infrared sauna and black cold plunge recovery suite',
  },
  {
    id: 'after-hours-sled',
    name: 'After-Hours Sled & Carry',
    category: 'Conditioning',
    time: '07:00 PM',
    duration: '55 min',
    trainer: 'Elena Rostova',
    intensityLabel: 'High Output · 9/10',
    intensityLevel: 3,
    spotsLeft: 7,
    image: '/images/class_conditioning_1795573053565.jpg',
    imageAlt: 'Evening sled sprint and loaded carry conditioning session',
  },
];

export const TRAINER_PROFILES: TrainerProfile[] = [
  {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Head Strength Coach',
    specialty: 'Powerlifting & Squat Biomechanics',
    credentials: 'CSCS · USAPL National Coach',
    bio: 'Former 93kg national podium lifter specializing in conjugate strength cycles and raw squat mechanics.',
    instagramHandle: '@marcusvance.lifts',
    instagramUrl: 'https://instagram.com',
    image: '/images/trainer_marcus_1795573054313.jpg',
    imageAlt: 'Portrait of Head Strength Coach Marcus Vance in the squat rack bay',
  },
  {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Conditioning Director',
    specialty: 'Metabolic Turf & Hyrox Prep',
    credentials: 'NASM-PES · Exos Performance',
    bio: 'Builds relentless work capacity through heavy sled work, threshold erg intervals, and anaerobic pacing.',
    instagramHandle: '@elenarostova.fit',
    instagramUrl: 'https://instagram.com',
    image: '/images/trainer_elena_1795573054396.jpg',
    imageAlt: 'Portrait of Conditioning Director Elena Rostova in the training hall',
  },
  {
    id: 'devon-hale',
    name: 'Devon Hale',
    role: 'Olympic & Mobility Lead',
    specialty: 'Snatch, Clean & Joint Longevity',
    credentials: 'USAW-L2 · FRC Mobility Specialist',
    bio: 'Pairs explosive barbell speed with end-range thoracic and hip resilience so lifters stay healthy under heavy loads.',
    instagramHandle: '@devonhale.barbell',
    instagramUrl: 'https://instagram.com',
    image: '/images/trainer_devon_1795573054904.jpg',
    imageAlt: 'Portrait of Olympic Weightlifting and Mobility Coach Devon Hale',
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'monthly-open',
    name: 'Monthly Open Gym',
    subtitle: '24/7 floor access with zero long-term lock-in',
    monthlyPrice: 89,
    yearlyMonthlyPrice: 71,
    ctaLabel: 'Select Monthly Plan',
    features: [
      '24/7 biometric access to all 42 racks & turf',
      'Calibrated Eleiko & Rogue competition bars',
      '1 complimentary InBody scan & form check',
      'Locker rooms, towel service & chalk stations',
    ],
  },
  {
    id: 'annual-all-access',
    name: 'Annual All-Access',
    subtitle: 'Unlimited classes, 24/7 floor & full recovery suite',
    monthlyPrice: 139,
    yearlyMonthlyPrice: 109,
    isBestValue: true,
    ctaLabel: 'Claim Best Value',
    features: [
      'Everything in Open Gym 24/7 access',
      'Unlimited Barbell, Metcon & Mobility classes',
      'Daily infrared sauna & 39°F cold plunge access',
      '2 guest passes per month + quarterly programming',
    ],
  },
  {
    id: 'vip-coaching',
    name: 'VIP Pro Coaching',
    subtitle: '1-on-1 custom programming & private coach check-ins',
    monthlyPrice: 259,
    yearlyMonthlyPrice: 207,
    ctaLabel: 'Apply for VIP',
    features: [
      'Everything in Annual All-Access & Recovery',
      '4 private 1-on-1 coaching sessions every month',
      'Weekly video bar-path review & macro adjustments',
      'Dedicated private gear locker & priority booking',
    ],
  },
];

export const GYM_INFO = {
  brand: 'IRONWORK',
  fullName: 'Ironwork Barbell',
  city: 'Austin, TX',
  addressLine1: '1420 S Congress Ave, Suite B',
  addressLine2: 'Austin, TX 78704',
  phone: '(512) 555-0194',
  email: 'hello@ironworkbarbell.com',
  hoursMember: '24/7 Keycard Access (365 Days)',
  hoursStaffed: 'Staffed Daily · 6:00 AM – 9:00 PM',
};

export const MEMBER_TESTIMONIALS: MemberTestimonial[] = [
  {
    id: 'carlos-mendez',
    name: 'Carlos Mendez',
    division: '93kg Raw Open',
    memberSince: 'Member Since 2024',
    quote:
      'I stalled around a 315 lb squat for two years training alone at commercial gyms. Switching to Ironwork fixed my bracing mechanics in week one, and having 24/7 calibrated racks let me peak without rushing sets before work.',
    milestoneMetric: '+245 lb Meet Total (1,110 → 1,355 lbs)',
    timeframe: '11 Months',
    coachWorkedWith: 'Marcus Vance',
    image: '/images/member_carlos_1795573567583.jpg',
    imageAlt: 'Carlos Mendez wrapping his wrists before a heavy barbell bench session at Ironwork Barbell',
  },
  {
    id: 'maya-robinson',
    name: 'Maya Robinson',
    division: '69kg Competitive Lifter',
    memberSince: 'Member Since 2023',
    quote:
      'Showing up at 5:30 AM used to feel isolating, but the Friday Barbell Club and turf sessions gave me reliable training partners. Adding cold plunge contrast twice a week kept my hips feeling fresh right into state nationals.',
    milestoneMetric: '375 lb Deadlift · 1st Place State Open',
    timeframe: '14 Months',
    coachWorkedWith: 'Elena Rostova',
    image: '/images/member_maya_1795573559046.jpg',
    imageAlt: 'Maya Robinson smiling beside a loaded squat rack after training at Ironwork Barbell',
  },
  {
    id: 'tariq-al-mansoor',
    name: 'Tariq Al-Mansoor',
    division: '105kg Masters I',
    memberSince: 'Member Since 2024',
    quote:
      'At 43 I thought heavy pulling was behind me after nagging lower-back flare-ups. Devon rebuilt my hip hinge and ankle mobility over twelve weeks, and I just pulled a lifetime 545 lb deadlift pain-free.',
    milestoneMetric: '545 lb Deadlift · Zero Back Pain',
    timeframe: '9 Months',
    coachWorkedWith: 'Devon Hale',
    image: '/images/member_tariq_1795573560038.jpg',
    imageAlt: 'Tariq Al-Mansoor wearing a leather lifting belt beside a steel power rack',
  },
  {
    id: 'hannah-callahan',
    name: 'Hannah Callahan',
    division: '63kg Junior Division',
    memberSince: 'Member Since 2025',
    quote:
      'I walked in nervous to touch a competition bar. The coaches broke down my pause bench and squat depth without ego, and six months later I hit all nine lifts on the platform at my first USAPL meet.',
    milestoneMetric: '9/9 Meet Lifts · 780 lb Total',
    timeframe: '6 Months',
    coachWorkedWith: 'Marcus Vance',
    image: '/images/member_hannah_1795573558586.jpg',
    imageAlt: 'Hannah Callahan standing in front of calibrated barbell racks after her lifting session',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'after-hours-access',
    category: 'Facility Access',
    question: 'How do I access the facility after hours?',
    answer:
      'Every active member receives encrypted smartphone keycard credentials through the Ironwork mobile app during check-in. Hold your phone near the South Congress front-door reader anytime—3:00 AM, weekends, or holidays—for instant 24/7 entry, backed by overnight badge logging and emergency call stations on the floor.',
  },
  {
    id: 'free-trial-included',
    category: 'Trial Pass',
    question: 'What is included in the free trial?',
    answer:
      'Your 3-day free trial includes full gym floor access across all 42 calibrated racks and turf lanes, one coach-led Barbell Club or Metcon Turf session, a complimentary InBody scan, and one contrast recovery session in our infrared sauna and 39°F cold plunge suite.',
  },
  {
    id: 'rack-availability',
    category: 'Equipment',
    question: 'Do I have to wait for squat racks during peak hours?',
    answer:
      'No. We built the floor around 42 competition-spec Eleiko and Rogue racks, 12 dedicated deadlift platforms, and calibrated competition kilo and pound plates so lifters never wait 20 minutes to start their primary working sets.',
  },
  {
    id: 'chalk-and-gear',
    category: 'Training Rules',
    question: 'Can I use chalk, lifting belts, and specialty bars?',
    answer:
      'Yes. Complimentary block chalk bowls sit at every lifting platform, and our bar rack includes Texas Power Bars, Kabuki trap bars, safety squat bars, and competition bench stations. We only ask members to wipe bars and re-rack plates when finished.',
  },
  {
    id: 'recovery-zone-access',
    category: 'Recovery',
    question: 'Are infrared sauna and cold plunge sessions extra?',
    answer:
      'Daily 185°F cedar infrared sauna and 39°F cold plunge contrast access are included with Annual All-Access and VIP Pro Coaching memberships. Monthly Open Gym members can book single recovery passes at the front desk or upgrade anytime.',
  },
  {
    id: 'cancellation-policy',
    category: 'Billing',
    question: 'How do cancellations or membership freezes work?',
    answer:
      'Monthly Open Gym plans run month-to-month with zero initiation fees and can be paused or canceled anytime with 14 days notice directly from your member portal. Annual members also receive up to 60 days of complimentary travel or injury freezes per year.',
  },
];

export const MILESTONE_BADGES: MilestoneBadge[] = [
  {
    id: 'hundredth-workout',
    code: '01',
    title: '100th Workout',
    category: 'Consistency',
    criteria: 'Complete 100 biometric keycard check-ins at South Congress.',
    perk: 'Unlocks Ironwork 100-Club embroidered gym towel',
    unitLabel: 'check-ins',
    currentProgress: 100,
    targetProgress: 100,
    defaultUnlocked: true,
    iconKey: 'workout',
  },
  {
    id: 'new-pr-club',
    code: '02',
    title: 'New PR Club',
    category: 'Platform',
    criteria: 'Verify a new Squat, Bench, or Deadlift personal best with a coach.',
    perk: 'Name stamped on the seasonal PR Chalkboard',
    unitLabel: 'verified PR',
    currentProgress: 1,
    targetProgress: 1,
    defaultUnlocked: true,
    iconKey: 'pr',
  },
  {
    id: 'one-year-member',
    code: '03',
    title: '1-Year Member',
    category: 'Loyalty',
    criteria: 'Maintain 12 consecutive months of active Ironwork membership.',
    perk: 'Complimentary 1-on-1 technique audit + guest pass',
    unitLabel: 'months',
    currentProgress: 9,
    targetProgress: 12,
    defaultUnlocked: false,
    iconKey: 'year',
  },
  {
    id: 'contrast-25',
    code: '04',
    title: 'Contrast Veteran',
    category: 'Recovery',
    criteria: 'Log 25 full infrared sauna and 39°F cold plunge contrast rounds.',
    perk: 'Priority weekend recovery suite booking',
    unitLabel: 'sessions',
    currentProgress: 25,
    targetProgress: 25,
    defaultUnlocked: true,
    iconKey: 'recovery',
  },
  {
    id: 'four-plate-pull',
    code: '05',
    title: '4-Plate Deadlift',
    category: 'Strength',
    criteria: 'Pull 405 lbs (184 kg) cleanly to full lockout without straps.',
    perk: 'Unlocks Ironwork heavy chalk bag & wristband',
    unitLabel: 'lbs',
    currentProgress: 365,
    targetProgress: 405,
    defaultUnlocked: false,
    iconKey: 'plate',
  },
  {
    id: 'thousand-lb-club',
    code: '06',
    title: '1,000 lb Club',
    category: 'Elite Total',
    criteria: 'Hit a verified 1,000 lb combined Squat, Bench, and Deadlift total.',
    perk: 'Engraved South Congress wall plate + meet shirt',
    unitLabel: 'lbs total',
    currentProgress: 895,
    targetProgress: 1000,
    defaultUnlocked: false,
    iconKey: 'total',
  },
];

export const GYM_PLAYLISTS: GymPlaylistMix[] = [
  {
    id: 'heavy-lifting-mix',
    code: '01',
    name: 'Ironwork Heavy Lifting Mix',
    focus: 'Max Effort Singles & PRs',
    bpmRange: '138–154 BPM',
    totalDuration: '1 hr 48 min',
    spotifyPlaylistId: '37i9dQZF1DX76Wlfdnj7AP',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
    description:
      'Our official South Congress floor rotation: distorted low-end riffs, relentless percussion, and zero pop radio filler when the bar bends.',
    tracks: [
      { title: 'Calibrated Steel (Intro)', artist: 'Ironwork Floor Select', bpm: 142, duration: '03:18' },
      { title: 'No Belt Needed', artist: 'South Congress Sound', bpm: 148, duration: '03:45' },
      { title: 'Chalk Dust & Lockout', artist: 'Barton Springs Heavy', bpm: 152, duration: '04:02' },
      { title: '4:30 AM Keycard', artist: 'East Austin Riot', bpm: 140, duration: '03:31' },
      { title: 'Nine For Nine', artist: 'Concrete & Knurling', bpm: 150, duration: '03:54' },
    ],
  },
  {
    id: 'turf-conditioning-mix',
    code: '02',
    name: 'Turf Engine & Sled Intervals',
    focus: 'Metcon & Anaerobic Threshold',
    bpmRange: '155–172 BPM',
    totalDuration: '1 hr 12 min',
    spotifyPlaylistId: '37i9dQZF1DX0hWmn8d5pRe',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0hWmn8d5pRe',
    description:
      'High-cadence industrial breakbeats and driving basslines matched to 40-meter prowler pushes, assault bike sprints, and farmer carries.',
    tracks: [
      { title: 'Prowler Drive 40m', artist: 'Turf Lane Syndicate', bpm: 164, duration: '03:12' },
      { title: 'Redline Interval', artist: 'Volt Cadence', bpm: 168, duration: '02:58' },
      { title: 'Threshold Bell', artist: 'Congress Ave Club', bpm: 160, duration: '03:40' },
      { title: 'Carry Heavy', artist: 'Sub-Zero Bass', bpm: 170, duration: '03:24' },
    ],
  },
  {
    id: 'recovery-downshift-mix',
    code: '03',
    name: 'Contrast & Mobility Downshift',
    focus: 'Infrared Sauna & Cold Plunge',
    bpmRange: '72–90 BPM',
    totalDuration: '54 min',
    spotifyPlaylistId: '37i9dQZF1DX4sWSpwq3LiO',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    description:
      'Subdued analog synth textures and steady breathing cadences piped into the cedar sauna and 39°F plunge suite after heavy platform days.',
    tracks: [
      { title: '39 Degrees Stillness', artist: 'Basalt Ambient', bpm: 74, duration: '05:10' },
      { title: 'Cedar Heat Cadence', artist: 'Restorative Pulse', bpm: 80, duration: '04:42' },
      { title: 'Nasal Reset', artist: 'Downshift Lab', bpm: 76, duration: '04:15' },
      { title: 'Post-Meet Drift', artist: 'Austin Dusk', bpm: 84, duration: '05:04' },
    ],
  },
];

export const FACILITY_HIGHLIGHTS: FacilityHighlight[] = [
  {
    id: 'powerlifting-equipment',
    code: '01',
    zone: 'Strength Floor',
    title: 'Calibrated Powerlifting Racks',
    spec: '42 Eleiko & Rogue Racks · 12 Oak Platforms',
    description:
      'IPF-spec competition racks, Texas Power Bars, Kabuki specialty bars, and calibrated kilo and pound steel plate trees stocked at every station.',
    image: '/images/facility_equipment_1795581050637.jpg',
    imageAlt:
      'Row of calibrated Eleiko and Rogue powerlifting racks with competition steel plates and oak deadlift platforms',
  },
  {
    id: 'turf-area',
    code: '02',
    zone: 'Conditioning Bay',
    title: '40m Turf & Sled Conditioning Lane',
    spec: '40-Meter Shock Turf · Prowlers & Ergs',
    description:
      'Dedicated indoor sprint turf lined with weighted prowler sleds, competition kettlebells, sandbags, and Concept2 / Rogue Echo ergs.',
    image: '/images/facility_turf_1795581050447.jpg',
    imageAlt:
      '40-meter black athletic conditioning turf lane with weighted sleds, kettlebells, and assault bikes',
  },
  {
    id: 'infrared-sauna',
    code: '03',
    zone: 'Recovery Suite',
    title: '185°F Cedar Infrared Sauna',
    spec: 'Full-Spectrum Heat · Western Red Cedar',
    description:
      'Walk-in glass-front cedar sauna built to drop cortisol, clear soreness after heavy deadlift blocks, and accelerate cardiovascular conditioning.',
    image: '/images/facility_sauna_1795581051236.jpg',
    imageAlt:
      'Custom western red cedar infrared sauna with warm amber bench lighting inside the recovery suite',
  },
  {
    id: 'cold-plunge',
    code: '04',
    zone: 'Contrast Therapy',
    title: '39°F Dual Cold Plunge Tubs',
    spec: 'Continuous Ozone Filtration · Basalt Suite',
    description:
      'Twin stainless-steel plunge basins held steady at 39°F with commercial UV and ozone sanitation for clean, rapid post-session inflammation control.',
    image: '/images/facility_cold_plunge_1795581051504.jpg',
    imageAlt:
      'Dual matte black cold plunge tubs filled with chilled water on dark stone tile',
  },
];
