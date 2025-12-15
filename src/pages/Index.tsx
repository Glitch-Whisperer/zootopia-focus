import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { ApartmentView } from '@/components/game/ApartmentView';
import { PhoneMenu } from '@/components/game/PhoneMenu';
import { BiomeTimer } from '@/components/game/BiomeTimer';
import { ZPDTimer } from '@/components/game/ZPDTimer';
import { HustleTimer } from '@/components/game/HustleTimer';
import { CharacterType } from '@/types/game';

const Index = () => {
  const [character] = useState<CharacterType>('fox');
  const {
    stats,
    timer,
    currentMode,
    showPhone,
    setShowPhone,
    startCitizenMode,
    startZPDMode,
    advanceZPDStage,
    startHustleMode,
    abandonSession,
    goHome,
  } = useGameState();

  // Render based on current mode
  if (currentMode === 'citizen' && timer.isActive) {
    return (
      <BiomeTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={goHome}
      />
    );
  }

  if (currentMode === 'zpd' && (timer.isActive || timer.timeRemaining === 0)) {
    return (
      <ZPDTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={goHome}
        onAdvanceStage={advanceZPDStage}
      />
    );
  }

  if (currentMode === 'hustle' && (timer.isActive || timer.timeRemaining === 0)) {
    return (
      <HustleTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={goHome}
      />
    );
  }

  // Default: Home/Apartment view
  return (
    <>
      <ApartmentView 
        stats={stats} 
        character={character}
        onOpenPhone={() => setShowPhone(true)}
      />
      <PhoneMenu 
        isOpen={showPhone}
        onClose={() => setShowPhone(false)}
        onStartCitizen={startCitizenMode}
        onStartZPD={startZPDMode}
        onStartHustle={startHustleMode}
        stats={stats}
      />
    </>
  );
};

export default Index;
