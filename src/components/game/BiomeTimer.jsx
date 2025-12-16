import { useState, useMemo } from 'react';

import { Snowflake, TreePine, Sun, Home, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionAlert } from './SessionAlert';
import tundraBg from '@/assets/biome-tundra-bg.png';
import rainforestBg from '@/assets/biome-rainforest-bg.png';
import saharaBg from '@/assets/biome-sahara-bg.png';

const biomeConfig = {
  tundra: { 
    icon: Snowflake, 
    name: 'Tundratown', 
    colorClass: 'text-tundra',
    bgImage: tundraBg,
  },
  rainforest: { 
    icon: TreePine, 
    name: 'Rainforest District', 
    colorClass: 'text-rainforest',
    bgImage: rainforestBg,
  },
  sahara: { 
    icon: Sun, 
    name: 'Sahara Square', 
    colorClass: 'text-sahara',
    bgImage: saharaBg,
  },
};

export function BiomeTimer({ timer, onPause, onResume, onReset, onGoHome }) {
  const [showAlert, setShowAlert] = useState(false);
  
  const biome = timer.biome || 'tundra';
  const config = biomeConfig[biome];
  const Icon = config.icon;

  const progress = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  
  const timeDisplay = useMemo(() => {
    const mins = Math.floor(timer.timeRemaining / 60);
    const secs = timer.timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timer.timeRemaining]);

  const isComplete = timer.timeRemaining === 0;
  const isPaused = !timer.isActive && timer.timeRemaining > 0;

  // Generate particles based on biome
  const particles = useMemo(() => {
    const count = biome === 'tundra' ? 20 : biome === 'rainforest' ? 15 : 10;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
  }, [biome]);

  const handleHomeClick = () => {
    if (!isComplete) {
      setShowAlert(true);
    } else {
      onGoHome();
    }
  };

  const handleConfirmLeave = () => {
    setShowAlert(false);
    onGoHome();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: `url(${config.bgImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent`} />
      
      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className={`absolute w-2 h-2 rounded-full ${
              biome === 'tundra' ? 'bg-tundra/40 animate-snow' :
              biome === 'rainforest' ? 'bg-rainforest/30 animate-steam' :
              'bg-sahara/30 animate-heat'
            }`}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${config.colorClass}`} />
          <h1 className={`font-display text-2xl ${config.colorClass}`}>
            {config.name}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleHomeClick}
          className="text-foreground/60 hover:text-foreground glass-panel"
        >
          <Home className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Timer */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          {/* Circular Progress */}
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className={config.colorClass}
              style={{ transition: 'stroke-dasharray 1s linear' }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-6xl ${config.colorClass}`}>
              {timeDisplay}
            </span>
            <span className="text-muted-foreground text-sm mt-2">
              {isComplete ? 'Complete!' : isPaused ? 'Paused' : 'Focus Time'}
            </span>
          </div>
        </div>

        {/* Biome-specific mechanic hint */}
        <div className="mt-8 glass-panel p-4 max-w-xs text-center">
          <p className="text-sm text-muted-foreground">
            {biome === 'tundra' && "❄️ The Freeze: Stay focused in the cold!"}
            {biome === 'rainforest' && "🌿 Riding the gondola through the mist..."}
            {biome === 'sahara' && "☀️ The heat is rising, stay focused!"}
          </p>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="relative z-10 p-6">
        {isComplete ? (
          <Button 
            onClick={onGoHome}
            className="w-full font-display text-lg py-6"
            variant="default"
          >
            Return Home 🏠
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button 
              onClick={isPaused ? onResume : onPause}
              variant="outline"
              className="flex-1 font-display py-6 glass-panel border-border/50"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button 
              onClick={onReset}
              variant="outline"
              className="font-display py-6 glass-panel border-border/50"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        )}
      </footer>

      {/* Session Alert */}
      <SessionAlert 
        isOpen={showAlert}
        onConfirm={handleConfirmLeave}
        onCancel={() => setShowAlert(false)}
        mode="citizen"
      />
    </div>
  );
}
