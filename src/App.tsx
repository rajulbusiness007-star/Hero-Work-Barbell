/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyUsSection } from './components/WhyUsSection';
import { FacilityHighlightsSection } from './components/FacilityHighlightsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TrainersSection } from './components/TrainersSection';
import { MemberSuccessSection } from './components/MemberSuccessSection';
import { MemberMilestonesSection } from './components/MemberMilestonesSection';
import { GymVibeSection } from './components/GymVibeSection';
import { MacroCalculatorSection } from './components/MacroCalculatorSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { LocationMapSection } from './components/LocationMapSection';
import { Footer } from './components/Footer';
import { TrialBookingModal } from './components/TrialBookingModal';
import { GymChatWidget } from './components/GymChatWidget';
import type { GymClassSession, PricingTier } from './data/gymData';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [reservedClassIds, setReservedClassIds] = useState<string[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  function openGeneralTrialModal() {
    setSelectedTier(null);
    setModalOpen(true);
  }

  function handleSelectTier(tier: PricingTier, billing: 'monthly' | 'yearly') {
    setSelectedTier(tier);
    setSelectedBilling(billing);
    setModalOpen(true);
  }

  function handleToggleReserve(session: GymClassSession) {
    setReservedClassIds((prev) =>
      prev.includes(session.id)
        ? prev.filter((id) => id !== session.id)
        : [...prev, session.id]
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Navbar onBookTrial={openGeneralTrialModal} />

        <main className="flex-1">
          <HeroSection onClaimPass={openGeneralTrialModal} />
          <WhyUsSection />
          <FacilityHighlightsSection />
          <ScheduleSection
            reservedIds={reservedClassIds}
            onToggleReserve={handleToggleReserve}
          />
          <TrainersSection />
          <MemberSuccessSection />
          <MemberMilestonesSection />
          <GymVibeSection />
          <MacroCalculatorSection onBookConsult={openGeneralTrialModal} />
          <PricingSection onSelectTier={handleSelectTier} />
          <FaqSection onBookTrial={openGeneralTrialModal} />
          <LocationMapSection onBookTrial={openGeneralTrialModal} />
        </main>

        <Footer />

        <TrialBookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedTier={selectedTier}
          billing={selectedBilling}
        />

        <GymChatWidget />
      </div>
    </MotionConfig>
  );
}
