import { useState, useMemo } from 'react';

import { Search, Car, Lock, Home, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionAlert } from './SessionAlert';

const stageConfig = {
  clues: { 
    icon: Search, 
    name: 'Gather Clues', 
    description: 'Scanning for evidence...',
    color: 'text-tundra'
  },
  chase: { 
    icon: Car, 
    name: 'The Chase', 
    description: 'Pursuing the suspect!',
    color: 'text-rainforest'
  },
  arrest: { 
    icon: Lock, 
    name: 'The Arrest', 
    description: 'Making the collar...',
    color: 'text-sahara'
  },
};

const stageOrder[] = ['clues', 'chase', 'arrest'];

export function ZPDTimer({ timer, onPause, onResume, onReset, onGoHome, onAdvanceStage }) {
  const [showAlert, setShowAlert] = useState(false);
  
  const stage = timer.zpdStage || 'clues';
  const config = stageConfig[stage];
  const Icon = config.icon;
  const currentStageIndex = stageOrder.indexOf(stage);

  const progress = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  
  const timeDisplay = useMemo(() => {
    const mins = Math.floor(timer.timeRemaining / 60);
    const secs = timer.timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timer.timeRemaining]);

  const isStageComplete = timer.timeRemaining === 0;
  const isAllComplete = isStageComplete && stage === 'arrest';
  const isPaused = !timer.isActive && timer.timeRemaining > 0;

  const handleHomeClick = () => {
    if (!isAllComplete && timer.timeRemaining > 0) {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/20 via-background to-background relative overflow-hidden">
      {/* Police Lights Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-2 bg-primary/30 animate-pulse" />
        <div className="absolute top-0 right-0 w-1/2 h-2 bg-destructive/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h1 className="font-display text-xl text-foreground">
              ZPD Duty
            </h1>
            <p className="text-sm text-muted-foreground">{config.name}</p>
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

      {/* Stage Progress */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          {stageOrder.map((s, i) => {
            const StageIcon = stageConfig[s].icon;
            const isCompleted = i < currentStageIndex;
            const isCurrent = i === currentStageIndex;
            
            return (
              <div key={s} className="flex items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${isCompleted ? 'bg-primary text-primary-foreground' : 
                    isCurrent ? 'bg-primary/30 text-primary ring-2 ring-primary' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  <StageIcon className="w-5 h-5" />
                </div>
                {i < stageOrder.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Timer */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          {/* Badge Shape Progress */}
          <div className="w-64 h-64 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
                className="text-primary"
                style={{ transition: 'stroke-dasharray 1s linear' }}
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon className={`w-12 h-12 ${config.color} mb-2`} />
              <span className="font-display text-5xl text-foreground">
                {timeDisplay}
              </span>
              <span className="text-muted-foreground text-sm mt-2">
                {isPaused ? 'Paused' : `Stage ${currentStageIndex + 1} of 3`}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Description */}
        <div className="mt-8 glass-panel p-4 max-w-xs text-center">
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="relative z-10 p-6 space-y-3">
        {isAllComplete ? (
          <Button 
            onClick={onGoHome}
            className="w-full font-display text-lg py-6"
            variant="default"
          >
            Case Closed! Return to HQ 🎖️
          </Button>
        ) : isStageComplete ? (
          <Button 
            onClick={onAdvanceStage}
            className="w-full font-display text-lg py-6"
            variant="default"
          >
            Next Stage <ChevronRight className="w-5 h-5 ml-2" />
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
        mode="zpd"
      />
    </div>
  );
}
