import { useState, useCallback, useEffect } from 'react';
import { RANK_ORDER } from '@/types/game.js';

const DEFAULT_STATS = {
  pawpsicals: 500,
  rank: 'meter-maid',
  rankProgress: 0,
  apartmentLevel: 1,
  totalFocusMinutes: 0,
};

const DEFAULT_TIMER = {
  isActive: false,
  timeRemaining: 0,
  totalTime: 0,
  mode: 'home',
};

export function useGameState() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('metrofocus-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate from bucks to pawpsicals if needed
      if (parsed.bucks !== undefined && parsed.pawpsicals === undefined) {
        parsed.pawpsicals = parsed.bucks;
        delete parsed.bucks;
      }
      return parsed;
    }
    return DEFAULT_STATS;
  });

  const [ownedFurniture, setOwnedFurniture] = useState(() => {
    const saved = localStorage.getItem('metrofocus-furniture');
    return saved ? JSON.parse(saved) : [];
  });

  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [currentMode, setCurrentMode] = useState('home');
  const [showPhone, setShowPhone] = useState(false);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('metrofocus-stats', JSON.stringify(stats));
  }, [stats]);

  // Save furniture to localStorage
  useEffect(() => {
    localStorage.setItem('metrofocus-furniture', JSON.stringify(ownedFurniture));
  }, [ownedFurniture]);

  // Timer countdown
  useEffect(() => {
    if (!timer.isActive || timer.timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.timeRemaining <= 1) {
          // Timer completed!
          handleTimerComplete(prev);
          return { ...prev, isActive: false, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isActive]);

  const handleTimerComplete = useCallback((timerState) => {
    const minutesCompleted = Math.floor(timerState.totalTime / 60);
    
    setStats(prev => {
      let newStats = { 
        ...prev, 
        totalFocusMinutes: prev.totalFocusMinutes + minutesCompleted 
      };

      if (timerState.mode === 'citizen') {
        // Citizen mode rewards Pawpsicals
        newStats.pawpsicals += minutesCompleted * 10;
      } else if (timerState.mode === 'zpd') {
        // ZPD mode rewards Rank progress
        const newProgress = prev.rankProgress + 25;
        if (newProgress >= 100) {
          const currentRankIndex = RANK_ORDER.indexOf(prev.rank);
          if (currentRankIndex < RANK_ORDER.length - 1) {
            newStats.rank = RANK_ORDER[currentRankIndex + 1];
            newStats.rankProgress = newProgress - 100;
          } else {
            newStats.rankProgress = 100;
          }
        } else {
          newStats.rankProgress = newProgress;
        }
      } else if (timerState.mode === 'hustle') {
        // Hustle mode doubles bet
        newStats.pawpsicals += 500;
      }

      return newStats;
    });
  }, []);

  const startCitizenMode = useCallback((biome, minutes = 25) => {
    setCurrentMode('citizen');
    setTimer({
      isActive: true,
      timeRemaining: minutes * 60,
      totalTime: minutes * 60,
      mode: 'citizen',
      biome,
    });
    setShowPhone(false);
  }, []);

  const startZPDMode = useCallback(() => {
    setCurrentMode('zpd');
    setTimer({
      isActive: true,
      timeRemaining: 5 * 60, // First stage: 25 mins
      totalTime: 5 * 60,
      mode: 'zpd',
      zpdStage: 'clues',
    });
    setShowPhone(false);
  }, []);

  const advanceZPDStage = useCallback(() => {
    setTimer(prev => {
      const stages = ['clues', 'chase', 'arrest'];
      const currentIndex = stages.indexOf(prev.zpdStage || 'clues');
      
      if (currentIndex < stages.length - 1) {
        return {
          ...prev,
          isActive: true,
          timeRemaining: 5 * 60,
          totalTime: 5 * 60,
          zpdStage: stages[currentIndex + 1],
        };
      }
      return prev;
    });
  }, []);

  const startHustleMode = useCallback(() => {
    if (stats.pawpsicals < 500) return false;
    
    setStats(prev => ({ ...prev, pawpsicals: prev.pawpsicals - 500 }));
    setCurrentMode('hustle');
    setTimer({
      isActive: true,
      timeRemaining: 60 * 60,
      totalTime: 60 * 60,
      mode: 'hustle',
    });
    setShowPhone(false);
    return true;
  }, [stats.pawpsicals]);

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isActive: false }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isActive: true }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimer(prev => ({ 
      ...prev, 
      isActive: true,
      timeRemaining: prev.totalTime 
    }));
  }, []);

  const abandonSession = useCallback(() => {
    if (timer.mode === 'hustle') {
      // Lose all bet Pawpsicals (already deducted)
    }
    setTimer(DEFAULT_TIMER);
    setCurrentMode('home');
  }, [timer.mode]);

  const goHome = useCallback(() => {
    setTimer(DEFAULT_TIMER);
    setCurrentMode('home');
  }, []);

  const earnPawpsicals = useCallback((amount) => {
    setStats(prev => ({ ...prev, pawpsicals: prev.pawpsicals + amount }));
  }, []);

  const spendPawpsicals = useCallback((amount) => {
    if (stats.pawpsicals >= amount) {
      setStats(prev => ({ ...prev, pawpsicals: prev.pawpsicals - amount }));
      return true;
    }
    return false;
  }, [stats.pawpsicals]);

  const purchaseFurniture = useCallback((item) => {
    if (stats.pawpsicals >= item.cost && !ownedFurniture.includes(item.id)) {
      setStats(prev => ({ ...prev, pawpsicals: prev.pawpsicals - item.cost }));
      setOwnedFurniture(prev => [...prev, item.id]);
      
      // Check for apartment upgrade
      if (item.id === 'penthouse-key') {
        setStats(prev => ({ ...prev, apartmentLevel: 5 }));
      }
      return true;
    }
    return false;
  }, [stats.pawpsicals, ownedFurniture]);

  return {
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
    abandonSession,
    goHome,
    earnPawpsicals,
    spendPawpsicals,
    purchaseFurniture,
  };
}