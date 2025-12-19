import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';

// Components
import { LandingPage } from '@/pages/LandingPage';
import { RegionSelection } from '@/components/game/RegionSelection';
import { BiomeTimer } from '@/components/game/BiomeTimer';
import { ZPDTimer } from '@/components/game/ZPDTimer';
import { HustleTimer } from '@/components/game/HustleTimer';
import { TrainTransition } from '@/components/game/TrainTransition';

const Index = () => {
  // --- 1. STATE INITIALIZATION ---
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('metrofocus-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeRegion, setActiveRegion] = useState(() => {
    return localStorage.getItem('metrofocus-region') || null;
  });

  // ✅ THE FIX: Start "Loading" if we have a saved region
  // This blocks the UI so you never see the "Savanna Flash"
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('metrofocus-region'));

  const [showTrainTransition, setShowTrainTransition] = useState(false);
  const [trainDestination, setTrainDestination] = useState('home');
  
  // Ref to ensure we only run the restore logic once
  const hasRestoredSession = useRef(false);

  const {
    timer,
    currentMode,
    startCitizenMode,
    startZPDMode,
    startHustleMode,
    pauseTimer,
    resumeTimer,
    resetTimer,
    goHome,
    advanceZPDStage
  } = useGameState();

  // --- 2. RESTORE SESSION EFFECT ---
  useEffect(() => {
    // If we have a saved region but haven't synced the game engine yet
    if (activeRegion && !hasRestoredSession.current) {
        console.log("🔄 Syncing Game Engine to:", activeRegion);
        
        // 1. Force Game Engine to update immediately
        startCitizenMode(activeRegion, 25); 
        
        // 2. Mark as restored
        hasRestoredSession.current = true;

        // 3. Turn off loading after a tiny delay to ensure State Updated
        setTimeout(() => {
            setIsLoading(false);
        }, 50); // 50ms is enough for React to process the state change
    } else if (!activeRegion) {
        // If no region, we don't need to wait
        setIsLoading(false);
    }
  }, [activeRegion, startCitizenMode]);

  // --- 3. HANDLERS ---

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('metrofocus-user', JSON.stringify(userData));
    setActiveRegion(null); 
    localStorage.removeItem('metrofocus-region');
  };

  const handleRegionSelect = useCallback((regionId) => {
    setActiveRegion(regionId);
    localStorage.setItem('metrofocus-region', regionId);
    
    setTrainDestination(regionId);
    setShowTrainTransition(true);
  }, []);

  const handleTrainComplete = useCallback(() => {
    setShowTrainTransition(false);
    if (activeRegion) {
       startCitizenMode(activeRegion, 25);
    }
  }, [activeRegion, startCitizenMode]);

  const handleGoHome = useCallback(() => {
    setActiveRegion(null);
    localStorage.removeItem('metrofocus-region');
    hasRestoredSession.current = false; 
    goHome(); 
  }, [goHome]);


  // --- 4. VIEW LOGIC ---

  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  // ✅ LOADING GATE: Blocks the "Savanna Pop-in"
  if (isLoading) {
    return <div className="min-h-screen bg-black transition-colors duration-500" />;
  }

  // Normal View Logic
  if (!activeRegion) {
    return <RegionSelection onSelect={handleRegionSelect} />;
  }

  if (showTrainTransition) {
    return (
      <TrainTransition 
        isVisible={showTrainTransition}
        destination={trainDestination}
        onComplete={handleTrainComplete}
      />
    );
  }

  if (currentMode === 'zpd') {
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

  if (currentMode === 'hustle') {
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

  return (
    <BiomeTimer 
      key={activeRegion} 
      timer={timer} 
      onPause={pauseTimer}
      onResume={resumeTimer}
      onReset={resetTimer}
      onGoHome={handleGoHome} 
    />
  );
};

export default Index;