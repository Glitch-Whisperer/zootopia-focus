import { useMemo } from 'react';
import { TimerState, BiomeType } from '@/types/game';
import { Snowflake, TreePine, Sun, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BiomeTimerProps {
  timer: TimerState;
  onAbandon: () => void;
  onGoHome: () => void;
}

const biomeConfig: Record<BiomeType, { icon: typeof Snowflake; name: string; colorClass: string; bgClass: string }> = {
  tundra: { 
    icon: Snowflake, 
    name: 'Tundratown', 
    colorClass: 'text-tundra',
    bgClass: 'biome-tundra'
  },
  rainforest: { 
    icon: TreePine, 
    name: 'Rainforest District', 
    colorClass: 'text-rainforest',
    bgClass: 'biome-rainforest'
  },
  sahara: { 
    icon: Sun, 
    name: 'Sahara Square', 
    colorClass: 'text-sahara',
    bgClass: 'biome-sahara'
  },
};

export function BiomeTimer({ timer, onAbandon, onGoHome }: BiomeTimerProps) {
  const biome = timer.biome || 'tundra';
  const config = biomeConfig[biome];
  const Icon = config.icon;

  const progress = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  
  const timeDisplay = useMemo(() => {
    const mins = Math.floor(timer.timeRemaining / 60);
    const secs = timer.timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timer.timeRemaining]);

  const isComplete = timer.timeRemaining === 0 && !timer.isActive;

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

  return (
    <div className={`min-h-screen flex flex-col ${config.bgClass} relative overflow-hidden`}>
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
          <h1 className={`font-display text-2xl ${config.colorClass} text-glow-${biome}`}>
            {config.name}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onGoHome}
          className="text-foreground/60 hover:text-foreground"
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
            <span className={`font-display text-6xl ${config.colorClass} text-glow-${biome}`}>
              {timeDisplay}
            </span>
            <span className="text-muted-foreground text-sm mt-2">
              {isComplete ? 'Complete!' : 'Focus Time'}
            </span>
          </div>
        </div>

        {/* Biome-specific mechanic hint */}
        <div className="mt-8 glass-panel p-4 max-w-xs text-center">
          <p className="text-sm text-muted-foreground">
            {biome === 'tundra' && "❄️ The Freeze: Don't exit or the ice cracks!"}
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
          <Button 
            onClick={onAbandon}
            variant="destructive"
            className="w-full font-display"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Abandon Session
          </Button>
        )}
      </footer>
    </div>
  );
}
