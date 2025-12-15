import { useState, useCallback, useEffect } from 'react';
import { 
  PlayerStats, 
  TimerState, 
  GameMode, 
  BiomeType, 
  ZPDStage,
  RANK_ORDER 
} from '@/types/game';

const DEFAULT_STATS: PlayerStats = {
  bucks: 500,
  rank: 'meter-maid',
  rankProgress: 0,
  apartmentLevel: 1,
  totalFocusMinutes: 0,
};

const DEFAULT_TIMER: TimerState = {
  isActive: false,
  timeRemaining: 0,
  totalTime: 0,
  mode: 'home',
};

export function useGameState() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('metrofocus-stats');
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  const [ownedFurniture, setOwnedFurniture] = useState<string[]>(() => {
    const saved = localStorage.getItem('metrofocus-furniture');
    return saved ? JSON.parse(saved) : [];
  });

  const [timer, setTimer] = useState<TimerState>(DEFAULT_TIMER);
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
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

  const handleTimerComplete = useCallback((timerState: TimerState) => {
    const minutesCompleted = Math.floor(timerState.totalTime / 60);
    
    setStats(prev => {
      let newStats = { 
        ...prev, 
        totalFocusMinutes: prev.totalFocusMinutes + minutesCompleted 
      };

      if (timerState.mode === 'citizen') {
        // Citizen mode rewards Bucks
        newStats.bucks += minutesCompleted * 10;
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
        newStats.bucks += 500;
      }

      return newStats;
    });
  }, []);

  const startCitizenMode = useCallback((biome: BiomeType, minutes: number = 25) => {
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
      timeRemaining: 25 * 60, // First stage: 25 mins
      totalTime: 25 * 60,
      mode: 'zpd',
      zpdStage: 'clues',
    });
    setShowPhone(false);
  }, []);

  const advanceZPDStage = useCallback(() => {
    setTimer(prev => {
      const stages: ZPDStage[] = ['clues', 'chase', 'arrest'];
      const currentIndex = stages.indexOf(prev.zpdStage || 'clues');
      
      if (currentIndex < stages.length - 1) {
        return {
          ...prev,
          isActive: true,
          timeRemaining: 25 * 60,
          totalTime: 25 * 60,
          zpdStage: stages[currentIndex + 1],
        };
      }
      return prev;
    });
  }, []);

  const startHustleMode = useCallback(() => {
    if (stats.bucks < 500) return false;
    
    setStats(prev => ({ ...prev, bucks: prev.bucks - 500 }));
    setCurrentMode('hustle');
    setTimer({
      isActive: true,
      timeRemaining: 60 * 60,
      totalTime: 60 * 60,
      mode: 'hustle',
    });
    setShowPhone(false);
    return true;
  }, [stats.bucks]);

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
      // Lose all bet Bucks (already deducted)
    }
    setTimer(DEFAULT_TIMER);
    setCurrentMode('home');
  }, [timer.mode]);

  const goHome = useCallback(() => {
    setTimer(DEFAULT_TIMER);
    setCurrentMode('home');
  }, []);

  const earnBucks = useCallback((amount: number) => {
    setStats(prev => ({ ...prev, bucks: prev.bucks + amount }));
  }, []);

  const spendBucks = useCallback((amount: number) => {
    if (stats.bucks >= amount) {
      setStats(prev => ({ ...prev, bucks: prev.bucks - amount }));
      return true;
    }
    return false;
  }, [stats.bucks]);

  const purchaseFurniture = useCallback((item: { id: string; cost: number }) => {
    if (stats.bucks >= item.cost && !ownedFurniture.includes(item.id)) {
      setStats(prev => ({ ...prev, bucks: prev.bucks - item.cost }));
      setOwnedFurniture(prev => [...prev, item.id]);
      
      // Check for apartment upgrade
      if (item.id === 'penthouse-key') {
        setStats(prev => ({ ...prev, apartmentLevel: 5 }));
      }
      return true;
    }
    return false;
  }, [stats.bucks, ownedFurniture]);

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
    earnBucks,
    spendBucks,
    purchaseFurniture,
  };
}
