import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";

// Pages / Components
import { LandingPage } from "@/pages/LandingPage";
import { RegionSelection } from "@/components/game/RegionSelection";
import { BiomeTimer } from "@/components/game/BiomeTimer";
import { ZPDTimer } from "@/components/game/ZPDTimer";
import { HustleTimer } from "@/components/game/HustleTimer";
import { TrainTransition } from "@/components/game/TrainTransition";

const Index = () => {
  const navigate = useNavigate();

  // --- USER STATE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("metrofocus-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRegion, setActiveRegion] = useState(
    () => localStorage.getItem("metrofocus-region") || null
  );

  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem("metrofocus-region")
  );

  const [showTrainTransition, setShowTrainTransition] = useState(false);
  const [trainDestination, setTrainDestination] = useState("home");

  const hasRestoredSession = useRef(false);

  // --- GAME STATE ---
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
    advanceZPDStage,
  } = useGameState();

  // --- RESTORE SESSION ---
  useEffect(() => {
    if (activeRegion && !hasRestoredSession.current) {
      startCitizenMode(activeRegion, 25);
      hasRestoredSession.current = true;
      setTimeout(() => setIsLoading(false), 50);
    } else if (!activeRegion) {
      setIsLoading(false);
    }
  }, [activeRegion, startCitizenMode]);

  // --- HANDLERS ---
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("metrofocus-user", JSON.stringify(userData));
    setActiveRegion(null);
    localStorage.removeItem("metrofocus-region");
  };

  const handleRegionSelect = useCallback((regionId) => {
    setActiveRegion(regionId);
    localStorage.setItem("metrofocus-region", regionId);
    setTrainDestination(regionId);
    setShowTrainTransition(true);
  }, []);

  const handleTrainComplete = useCallback(() => {
    setShowTrainTransition(false);
    if (activeRegion) startCitizenMode(activeRegion, 25);
  }, [activeRegion, startCitizenMode]);

  const handleGoHome = useCallback(() => {
    setActiveRegion(null);
    localStorage.removeItem("metrofocus-region");
    hasRestoredSession.current = false;
    goHome();
  }, [goHome]);

  const handleOpenProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  // --- VIEW LOGIC ---
  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  if (!activeRegion) {
    return (
      <RegionSelection
        userStats={{
          totalFocusMinutes: timer.totalFocusMinutes ?? 0,
          currentStreak: timer.currentStreak ?? 0,
        }}
        onSelect={handleRegionSelect}
        onOpenProfile={handleOpenProfile}
      />
    );
  }

  if (showTrainTransition) {
    return (
      <TrainTransition
        isVisible
        destination={trainDestination}
        onComplete={handleTrainComplete}
      />
    );
  }

  if (currentMode === "zpd") {
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

  if (currentMode === "hustle") {
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
