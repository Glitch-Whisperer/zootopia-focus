import { useState, useMemo, useEffect } from 'react';
import { Search, Car, Lock, Home, ChevronRight, Pause, Play, RotateCcw, Zap, Trophy, AlertTriangle, Siren, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { SessionAlert } from './SessionAlert';   

 import zpdBackgroundImage from '../../assets/zpd.jpg';

const stageConfig = {
  clues: { 
    icon: Search, 
    name: 'Gather Clues', 
    description: 'Scanning area for evidence...',
    color: 'text-tundra',
    borderColor: 'border-tundra',
    shadowColor: 'shadow-tundra/50',
    overlayGradient: 'from-tundra/40 via-background/80 to-background',
    reward: '🔍 Evidence collected!',
  },
  chase: { 
    icon: Car, 
    name: 'The Chase', 
    description: 'Pursuing the suspect!',
    color: 'text-rainforest',
    borderColor: 'border-rainforest',
    shadowColor: 'shadow-rainforest/50',
    overlayGradient: 'from-rainforest/40 via-background/80 to-background',
    reward: '🚗 Suspect cornered!',
  },
  arrest: { 
    icon: Lock, 
    name: 'The Arrest', 
    description: 'Making the collar...',
    color: 'text-sahara',
    borderColor: 'border-sahara',
    shadowColor: 'shadow-sahara/50',
    overlayGradient: 'from-sahara/40 via-background/80 to-background',
    reward: '🏆 Case closed!',
  },
};

const stageOrder = ['clues', 'chase', 'arrest'];

export function ZPDTimer({ 
  timer, 
  onPause, 
  onResume, 
  onReset, 
  onGoHome, 
  onAdvanceStage 
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  
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

  useEffect(() => {
    if (isStageComplete && !isAllComplete) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    if (isAllComplete) {
      setSirenActive(true);
    }
  }, [isStageComplete, isAllComplete]);

  useEffect(() => {
    if (timer.timeRemaining <= 60 && timer.timeRemaining > 0 && timer.isActive) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timer.timeRemaining, timer.isActive]);

  const handleHomeClick = () => {
    if (!isAllComplete && timer.timeRemaining > 0) {
      setShowAlert(true);
    } else {
      onGoHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background font-sans">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
          style={{ backgroundImage: `url(${zpdBackgroundImage})` }}
        />
        
        {/* Stage-specific Color Overlay (Gradient Scrim) */}
        <div className={`absolute inset-0 bg-gradient-to-b ${config.overlayGradient} transition-colors duration-700`} />
        
        {/* Tech Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* --- AMBIENT EFFECTS LAYER --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-float" />
        <div className="absolute bottom-40 right-20 w-3 h-3 border border-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Siren Lights (Visual) */}
        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent transition-opacity duration-300 ${sirenActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent`} />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-20 flex flex-col h-full">
        
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 backdrop-blur-md bg-black/40 p-2 pr-4 rounded-full border border-white/10 shadow-lg">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 ${config.color} relative`}>
              <Shield className="w-5 h-5 fill-current opacity-20 absolute" />
              <Icon className="w-5 h-5 relative z-10" />
            </div>
            <div>
              <h1 className="font-display text-lg text-white leading-none tracking-wide">
                ZPD <span className="opacity-60 font-sans text-xs uppercase tracking-widest ml-1">Duty Mode</span>
              </h1>
              <p className={`text-xs ${config.color} font-medium mt-0.5 uppercase tracking-wider`}>{config.name}</p>
            </div>
          </div>
          
          <button
            onClick={handleHomeClick}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-black/40 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
          </button>
        </header>

        {/* Stage Progress Bar */}
        <div className="px-8 py-2">
          <div className="flex items-center justify-between relative max-w-md mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full" />
            
            {stageOrder.map((s, i) => {
              const StageIcon = stageConfig[s].icon;
              const isCompleted = i < currentStageIndex;
              const isCurrent = i === currentStageIndex;
              // Dynamic coloring based on stage status
              const activeClass = s === 'clues' ? 'text-tundra border-tundra shadow-tundra/50' 
                                : s === 'chase' ? 'text-rainforest border-rainforest shadow-rainforest/50' 
                                : 'text-sahara border-sahara shadow-sahara/50';
              
              return (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2
                    ${isCompleted ? `${activeClass} bg-background` : 
                      isCurrent ? `${activeClass} bg-background scale-110 shadow-[0_0_20px_currentColor]` : 
                      'bg-black/40 border-white/10 text-white/20'}
                  `}>
                    <StageIcon className="w-4 h-4" />
                  </div>
                  {isCurrent && (
                    <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-white/60">
                      Current
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Timer Display */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative group">
            
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-30 transition-colors duration-700 ${
              stage === 'clues' ? 'bg-tundra' : stage === 'chase' ? 'bg-rainforest' : 'bg-sahara'
            }`} />

            {/* Timer Circle Container */}
            <div className="w-72 h-72 relative backdrop-blur-md bg-black/30 rounded-full border border-white/10 shadow-2xl">
              
              {/* SVG Ring */}
              <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-black/40" />
                
                {/* Active Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.64} 264`}
                  className={`${config.color} transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_currentColor]`}
                />
              </svg>
              
              {/* Central Information */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                {/* Scanner Scanline Effect (Only active during Clues) */}
                {stage === 'clues' && timer.isActive && (
                  <div className="absolute inset-0 overflow-hidden rounded-full opacity-20 pointer-events-none">
                    <div className="w-full h-[20%] bg-tundra blur-md absolute animate-scan top-0" />
                  </div>
                )}

                <div className={`mb-4 transition-transform duration-300 ${timer.isActive ? 'scale-110' : 'scale-100'}`}>
                  <Icon className={`w-10 h-10 ${config.color} drop-shadow-lg`} />
                </div>
                
                <span className={`font-display text-6xl font-bold text-white tracking-tight drop-shadow-xl tabular-nums ${showWarning ? 'text-red-500 animate-pulse' : ''}`}>
                  {timeDisplay}
                </span>
                
                <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                   <Zap className={`w-3 h-3 ${config.color}`} />
                   <span className="text-xs text-white/90 font-bold tracking-wider">{isPaused ? 'PAUSED' : 'ACTIVE'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Context Text */}
          <div className="mt-8 text-center animate-fade-in">
            <h3 className="text-white/90 font-medium text-lg drop-shadow-md tracking-wide">{config.description}</h3>
            {showWarning && (
              <p className="text-red-400 font-bold text-sm mt-2 animate-bounce flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 
                HURRY! TIME IS RUNNING OUT!
              </p>
            )}
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="p-8 pb-10">
          {/* Reward Modal Popup Overlay */}
          {showReward && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-background/90 p-8 rounded-3xl border border-yellow-500/30 text-center transform animate-bounce-in shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">Excellent Work!</h2>
                <p className="text-muted-foreground text-lg">{config.reward}</p>
              </div>
            </div>
          )}

          {isAllComplete ? (
            <Button 
              onClick={onGoHome}
              className="w-full h-16 text-xl rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-[1.02] transition-transform shadow-lg shadow-yellow-500/20 border-0 text-white font-bold"
            >
              <Trophy className="w-6 h-6 mr-3" />
              Case Closed - Return to HQ
            </Button>
          ) : isStageComplete ? (
            <Button 
              onClick={onAdvanceStage}
              className={`w-full h-16 text-xl rounded-2xl bg-gradient-to-r ${
                stage === 'clues' ? 'from-tundra to-rainforest' : 'from-rainforest to-sahara'
              } hover:scale-[1.02] transition-transform shadow-lg border-0 text-white font-bold`}
            >
              Next Stage <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          ) : (
            <div className="flex gap-6 justify-center items-center">
              <button
                onClick={onReset}
                className="w-14 h-14 rounded-full backdrop-blur-md bg-black/30 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white hover:rotate-180 transition-all duration-500"
                title="Restart Stage"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={isPaused ? onResume : onPause}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 border-4 ${
                  isPaused 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]' 
                    : 'bg-white text-black border-white/30'
                }`}
              >
                {isPaused ? (
                  <Play className="w-8 h-8 ml-1 fill-current" />
                ) : (
                  <Pause className="w-8 h-8 fill-current" />
                )}
              </button>
            </div>
          )}
        </footer>
      </div>

      {/* Alert Dialog */}
      <SessionAlert 
        isOpen={showAlert}
        onConfirm={() => { setShowAlert(false); onGoHome(); }}
        onCancel={() => setShowAlert(false)}
        mode="zpd"
      />
    </div>
  );
}