import { useState, useMemo } from 'react';
import { TimerState } from '@/types/game';
import { DollarSign, Home, Flame, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionAlert } from './SessionAlert';

interface HustleTimerProps {
  timer: TimerState;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

export function HustleTimer({ timer, onPause, onResume, onReset, onGoHome }: HustleTimerProps) {
  const [showAlert, setShowAlert] = useState(false);
  
  const progress = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  
  const timeDisplay = useMemo(() => {
    const mins = Math.floor(timer.timeRemaining / 60);
    const secs = timer.timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timer.timeRemaining]);

  const isComplete = timer.timeRemaining === 0;
  const isPaused = !timer.isActive && timer.timeRemaining > 0;

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-bucks/20 via-background to-background relative overflow-hidden">
      {/* Money Rain Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            💵
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bucks/30 flex items-center justify-center animate-pulse-glow">
            <DollarSign className="w-5 h-5 text-bucks" />
          </div>
          <div>
            <h1 className="font-display text-xl text-bucks">
              The Hustle
            </h1>
            <p className="text-sm text-muted-foreground">High Stakes Mode</p>
          </div>
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

      {/* Bet Display */}
      <div className="px-6">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-sm text-muted-foreground">At Stake</div>
            <div className="font-display text-2xl text-destructive">500</div>
          </div>
          <Flame className="w-8 h-8 text-destructive animate-pulse" />
          <div className="text-center flex-1">
            <div className="text-sm text-muted-foreground">Potential Win</div>
            <div className="font-display text-2xl text-bucks">1,000</div>
          </div>
        </div>
      </div>

      {/* Main Timer */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          {/* Danger Ring */}
          {!isComplete && !isPaused && (
            <div className="absolute inset-0 rounded-full border-4 border-destructive/30 animate-pulse" />
          )}
          
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
              className="text-bucks"
              style={{ transition: 'stroke-dasharray 1s linear' }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <DollarSign className="w-10 h-10 text-bucks mb-2" />
            <span className="font-display text-5xl text-bucks">
              {timeDisplay}
            </span>
            <span className="text-muted-foreground text-sm mt-2">
              {isComplete ? 'YOU WIN!' : isPaused ? 'Paused' : 'Stay focused!'}
            </span>
          </div>
        </div>

        {/* Warning */}
        {!isComplete && (
          <div className="mt-8 bg-destructive/20 border border-destructive/30 rounded-xl p-4 max-w-xs text-center">
            <p className="text-sm text-destructive">
              ⚠️ Exit now and lose 500 Bucks!
            </p>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="relative z-10 p-6 space-y-3">
        {isComplete ? (
          <Button 
            onClick={onGoHome}
            className="w-full font-display text-lg py-6 bg-bucks text-background hover:bg-bucks/90"
          >
            Collect 1,000 Bucks! 💰
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
        mode="hustle"
      />
    </div>
  );
}
