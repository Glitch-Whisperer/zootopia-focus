import { useState, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { ApartmentView } from '@/components/game/ApartmentView';
import { PhoneMenu } from '@/components/game/PhoneMenu';
import { BiomeTimer } from '@/components/game/BiomeTimer';
import { ZPDTimer } from '@/components/game/ZPDTimer';
import { HustleTimer } from '@/components/game/HustleTimer';
import { TrainTransition } from '@/components/game/TrainTransition';
import { FurnitureShop } from '@/components/game/FurnitureShop';
import { CharacterType, BiomeType } from '@/types/game';

const Index = () => {
  const [character] = useState<CharacterType>('fox');
  const [showTrainTransition, setShowTrainTransition] = useState(false);
  const [trainDestination, setTrainDestination] = useState<BiomeType | 'home'>('home');
  const [pendingCitizenMode, setPendingCitizenMode] = useState<{ biome: BiomeType; minutes: number } | null>(null);
  const [showShop, setShowShop] = useState(false);
  
  const {
    stats,
    timer,
    currentMode,
    showPhone,
    ownedFurniture,
    setShowPhone,
    startCitizenMode,
    startZPDMode,
    advanceZPDStage,
    startHustleMode,
    pauseTimer,
    resumeTimer,
    resetTimer,
    goHome,
    purchaseFurniture,
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
    setTrainDestination('home');
    setShowTrainTransition(true);
  }, []);

  const handleTrainHomeComplete = useCallback(() => {
    setShowTrainTransition(false);
    goHome();
  }, [goHome]);

  const handleOpenShop = useCallback(() => {
    setShowPhone(false);
    setShowShop(true);
  }, [setShowPhone]);

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
  if (currentMode === 'citizen' && (timer.isActive || timer.timeRemaining > 0 || timer.timeRemaining === 0)) {
    return (
      <BiomeTimer 
        timer={timer} 
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onGoHome={handleGoHome}
      />
    );
  }

  if (currentMode === 'zpd' && (timer.isActive || timer.timeRemaining >= 0)) {
    return (
      <ZPDTimer 
        timer={timer} 
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onGoHome={handleGoHome}
        onAdvanceStage={advanceZPDStage}
      />
    );
  }

  if (currentMode === 'hustle' && (timer.isActive || timer.timeRemaining >= 0)) {
    return (
      <HustleTimer 
        timer={timer} 
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onGoHome={handleGoHome}
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
        onOpenShop={handleOpenShop}
        stats={stats}
      />
      <FurnitureShop
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        stats={stats}
        onPurchase={purchaseFurniture}
        ownedItems={ownedFurniture}
      />
    </>
  );
};

export default Index;
