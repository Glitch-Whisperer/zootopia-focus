import { useState, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { ApartmentView } from '@/components/game/ApartmentView';
import { PhoneMenu } from '@/components/game/PhoneMenu';
import { BiomeTimer } from '@/components/game/BiomeTimer';
import { ZPDTimer } from '@/components/game/ZPDTimer';
import { HustleTimer } from '@/components/game/HustleTimer';
import { TrainTransition } from '@/components/game/TrainTransition';
import { CharacterType, BiomeType } from '@/types/game';

const Index = () => {
  const [character] = useState<CharacterType>('fox');
  const [showTrainTransition, setShowTrainTransition] = useState(false);
  const [trainDestination, setTrainDestination] = useState<BiomeType | 'home'>('home');
  const [pendingCitizenMode, setPendingCitizenMode] = useState<{ biome: BiomeType; minutes: number } | null>(null);
  
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

  // Handle citizen mode with train transition
  const handleStartCitizen = useCallback((biome: BiomeType, minutes: number) => {
    setShowPhone(false);
    setPendingCitizenMode({ biome, minutes });
    setTrainDestination(biome);
    setShowTrainTransition(true);
  }, [setShowPhone]);

  // Handle train transition complete
  const handleTrainComplete = useCallback(() => {
    setShowTrainTransition(false);
    if (pendingCitizenMode) {
      startCitizenMode(pendingCitizenMode.biome, pendingCitizenMode.minutes);
      setPendingCitizenMode(null);
    }
  }, [pendingCitizenMode, startCitizenMode]);

  // Handle going home with train transition
  const handleGoHome = useCallback(() => {
    if (timer.isActive) {
      abandonSession();
    } else {
      setTrainDestination('home');
      setShowTrainTransition(true);
    }
  }, [timer.isActive, abandonSession]);

  const handleGoHomeFromTimer = useCallback(() => {
    setTrainDestination('home');
    setShowTrainTransition(true);
  }, []);

  const handleTrainHomeComplete = useCallback(() => {
    setShowTrainTransition(false);
    goHome();
  }, [goHome]);

  // Train transition overlay
  if (showTrainTransition) {
    return (
      <TrainTransition 
        isVisible={showTrainTransition}
        destination={trainDestination}
        onComplete={trainDestination === 'home' ? handleTrainHomeComplete : handleTrainComplete}
      />
    );
  }

  // Render based on current mode
  if (currentMode === 'citizen' && timer.isActive) {
    return (
      <BiomeTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={handleGoHomeFromTimer}
      />
    );
  }

  if (currentMode === 'zpd' && (timer.isActive || timer.timeRemaining === 0)) {
    return (
      <ZPDTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={handleGoHomeFromTimer}
        onAdvanceStage={advanceZPDStage}
      />
    );
  }

  if (currentMode === 'hustle' && (timer.isActive || timer.timeRemaining === 0)) {
    return (
      <HustleTimer 
        timer={timer} 
        onAbandon={abandonSession} 
        onGoHome={handleGoHomeFromTimer}
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
        onStartCitizen={handleStartCitizen}
        onStartZPD={startZPDMode}
        onStartHustle={startHustleMode}
        stats={stats}
      />
    </>
  );
};

export default Index;
