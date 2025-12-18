import { useState, useMemo, useEffect } from 'react';
import { 
  Snowflake, TreePine, Sun, Home, Pause, Play, RotateCcw, 
  MapPin, Wind, CloudRain, Briefcase, Carrot, Moon, Flower 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionAlert } from './SessionAlert';
import { CharacterPopIn } from './CharacterPopIn';

// IMPORT YOUR CONFIG HELPER
import { getRegionById } from '@/config/regionsConfig'; 

// ID MAPPING
const ID_MAPPING = {
  'savanna': 'savanna-central',
  'sahara': 'sahara-square',
  'tundra': 'tundratown',
  'rainforest': 'rainforest', 
  'bunnyburrow': 'bunnyburrow',
  'little-rodentia': 'little-rodentia'
};

const REGION_ICONS = {
  'bunnyburrow': Carrot,
  'little-rodentia': Home, 
  'savanna-central': Briefcase,
  'rainforest': TreePine,
  'tundratown': Snowflake,
  'sahara-square': Sun,
  'nocturnal': Moon,
  'meadowlands': Flower,
  'outback-island': Sun,
};

export function BiomeTimer({ 
  timer = { biome: 'savanna-central', totalTime: 1500, timeRemaining: 1500, isActive: false }, 
  onPause, 
  onResume, 
  onReset, 
  onGoHome 
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasShownPopIn, setHasShownPopIn] = useState(false);
  
  // --- CONFIG & SAFETY ---
  const rawId = timer?.biome ? timer.biome : 'savanna-central';
  const mappedId = ID_MAPPING[rawId] || rawId;
  const regionConfig = getRegionById(mappedId) || getRegionById('savanna-central');
  const normalizedId = regionConfig.id;

  const Icon = REGION_ICONS[regionConfig.id] || MapPin;
  const primaryColor = regionConfig.themeColors?.primary ? `hsl(${regionConfig.themeColors.primary})` : 'hsl(200, 100%, 50%)';
  const glowColor = regionConfig.themeColors?.glow ? `hsl(${regionConfig.themeColors.glow})` : 'hsl(200, 100%, 70%)';
  
  // --- TIMER LOGIC ---
  const progress = ((timer.totalTime - timer.timeRemaining) / timer.totalTime) * 100;
  const timeDisplay = useMemo(() => {
    const mins = Math.floor(timer.timeRemaining / 60);
    const secs = timer.timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timer.timeRemaining]);

  const isComplete = timer.timeRemaining === 0;
  const isPaused = !timer.isActive && timer.timeRemaining > 0;

  useEffect(() => {
    if (!isComplete) setHasShownPopIn(false);
  }, [isComplete]);

  // --- PARTICLES ---
  const particles = useMemo(() => {
      let count = 20;
      let animType = 'float';
      const safeId = String(normalizedId);

      if (safeId.includes('tundra')) { count = 40; animType = 'snow'; }
      else if (safeId.includes('rainforest')) { count = 30; animType = 'mist'; }
      else if (safeId.includes('sahara')) { count = 15; animType = 'heat'; }
      
      return Array.from({ length: count }, (_, i) => ({ 
        id: i, 
        left: Math.random() * 100, 
        delay: Math.random() * 5, 
        duration: 3 + Math.random() * 5, 
        size: Math.random() * 4 + 2,
        animType 
      }));
  }, [normalizedId]);

  const handleHomeClick = () => {
    if (!isComplete && timer.timeRemaining > 0) {
      setShowAlert(true);
    } else {
      onGoHome();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black font-sans transition-colors duration-1000">
      
      {/* --- LAYER 1: BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
         <div 
            // ZOOM CHANGE: scale-105 -> scale-100
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-100" 
            style={{ backgroundImage: `url(${regionConfig.backgroundImage})` }} 
         />
         {/* Enhanced Gradient for better text readability */}
         <div 
            className="absolute inset-0 transition-colors duration-1000"
            style={{ 
              background: `linear-gradient(to bottom, 
                rgba(0,0,0,0.4) 0%, 
                rgba(0,0,0,0.1) 40%, 
                rgba(0,0,0,0.3) 70%, 
                rgba(0,0,0,0.9) 100%)` 
            }}
         />
         <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- LAYER 2: CHARACTER (RESIZED & POSITIONED) --- */}
      {regionConfig.characterSprite && (
         <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pointer-events-none overflow-hidden">
             {/* ZOOM CHANGE: h-[60vh] -> h-[50vh] */}
             <img 
               src={regionConfig.characterSprite} 
               alt={regionConfig.characterName}
               className="h-[50vh] w-auto object-contain object-bottom translate-y-6 transition-transform duration-1000"
               style={{
                 filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.6))',
                 animation: 'breathe 8s ease-in-out infinite'
               }}
             />
             {/* Floor Shadow to ground the character */}
             <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent" />
         </div>
      )}

      {/* --- LAYER 3: PARTICLES --- */}
       <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map(p => (
          <div 
            key={p.id} 
            className={`absolute rounded-full opacity-60 ${ 
              p.animType === 'snow' ? 'bg-white animate-snow' : 
              p.animType === 'mist' ? 'bg-emerald-300/40 animate-float' : 
              'bg-yellow-500/30 animate-heat-shimmer' 
            }`} 
            style={{ 
              left: `${p.left}%`, 
              width: `${p.size}px`, 
              height: `${p.size}px`, 
              animationDelay: `${p.delay}s`, 
              animationDuration: `${p.duration}s`, 
              top: p.animType === 'snow' ? '-10px' : undefined, 
              bottom: p.animType !== 'snow' ? '-10px' : undefined, 
            }} 
          />
        ))}
      </div>

      {/* --- LAYER 4: UI (PREMIUM GLASSMORPHISM) --- */}
      <div className="relative z-20 flex flex-col h-full">
        
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
           <div className="flex items-center gap-3 backdrop-blur-xl bg-black/30 p-2 pr-5 rounded-full border border-white/10 shadow-lg ring-1 ring-white/5">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 relative shadow-inner"
              style={{ color: primaryColor }}
            >
              <Icon className="w-5 h-5 relative z-10" />
            </div>
            <div>
              <h1 className="font-display text-lg text-white leading-none tracking-wide drop-shadow-sm">{regionConfig.name}</h1>
              <p className="text-xs font-medium mt-0.5 flex items-center gap-1 opacity-90" style={{ color: primaryColor }}>
                <MapPin className="w-3 h-3" /> Citizen Mode
              </p>
            </div>
          </div>
          <button onClick={handleHomeClick} className="w-10 h-10 rounded-full backdrop-blur-xl bg-black/30 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all shadow-lg ring-1 ring-white/5">
            <Home className="w-5 h-5" />
          </button>
        </header>

        {/* Main Timer */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
           <div className="relative group">
            {/* Ambient Glow */}
            <div 
              className="absolute inset-0 rounded-full blur-[60px] opacity-40 transition-colors duration-1000"
              style={{ backgroundColor: glowColor }} 
            />
            
            {/* --- TRUE GLASSMORPHISM TIMER --- */}
            {/* ZOOM CHANGE: w-72 h-72 -> w-64 h-64 */}
            <div className="w-64 h-64 relative backdrop-blur-2xl bg-black/20 rounded-full border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ring-1 ring-white/20">
              <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                {/* Track */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/5" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-black/20" />
                {/* Progress */}
                <circle 
                  cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="4" 
                  strokeLinecap="round" strokeDasharray={`${progress * 2.64} 264`} 
                  className="transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_currentColor]" 
                  style={{ color: primaryColor }}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className={`mb-3 transition-transform duration-300 ${timer.isActive ? 'scale-110' : 'scale-100'}`}>
                  <Icon className="w-8 h-8 drop-shadow-md opacity-90" style={{ color: primaryColor }} />
                </div>
                {/* ZOOM CHANGE: text-6xl -> text-5xl */}
                <span className="font-display text-5xl font-bold text-white tracking-tight drop-shadow-lg tabular-nums">
                  {timeDisplay}
                </span>
                
                {/* Inner Glass Badge */}
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                   <Wind className="w-3 h-3" style={{ color: primaryColor }} />
                   <span className="text-xs text-white/90 font-bold tracking-wider">{isPaused ? 'PAUSED' : isComplete ? 'COMPLETE' : 'FOCUSING'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* --- DESCRIPTION BOX (Glassmorphism) --- */}
          {/* ZOOM CHANGE: mt-10 -> mt-6 (to keep proportion) */}
          <div className="mt-6 px-8 py-4 rounded-2xl max-w-md text-center border border-white/10 bg-black/30 backdrop-blur-xl shadow-lg ring-1 ring-white/5 z-20">
            <p className="text-white/90 font-medium tracking-wide drop-shadow-md">{regionConfig.description}</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 pb-10 relative z-30">
           {isComplete ? (
            <Button 
              onClick={onGoHome} 
              className="w-full h-16 text-xl rounded-2xl transition-transform shadow-lg border-0 text-white font-bold hover:scale-[1.02]"
              style={{ 
                background: `linear-gradient(to right, ${primaryColor}, ${glowColor})`,
                boxShadow: `0 10px 30px -10px ${primaryColor.replace(')', ', 0.5)')}`
              }}
            >
              Session Complete - Return Home
            </Button>
          ) : (
            <div className="flex gap-6 justify-center items-center">
              <button onClick={onReset} className="w-14 h-14 rounded-full backdrop-blur-xl bg-black/30 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white hover:rotate-180 transition-all duration-500 shadow-lg ring-1 ring-white/5" title="Reset Timer">
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <button 
                onClick={isPaused ? onResume : onPause} 
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 border-4`}
                style={isPaused ? {
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderColor: primaryColor,
                  color: primaryColor,
                  boxShadow: `0 0 30px ${primaryColor.replace(')', ', 0.3)')}`,
                  backdropFilter: 'blur(10px)'
                } : {
                  backgroundColor: 'white',
                  color: 'black',
                  borderColor: 'rgba(255,255,255,0.3)'
                }}
              >
                {isPaused ? ( <Play className="w-8 h-8 ml-1 fill-current" /> ) : ( <Pause className="w-8 h-8 fill-current" /> )}
              </button>
            </div>
          )}
        </footer>
      </div>

      <CharacterPopIn 
        show={isComplete && !hasShownPopIn} 
        character={{
            name: regionConfig.characterName,
            sprite: regionConfig.characterSprite,
            message: regionConfig.characterMessage
        }}
        themeColor={primaryColor}
        onAnimationEnd={() => setHasShownPopIn(true)}
      />

      <SessionAlert isOpen={showAlert} onConfirm={() => { setShowAlert(false); onGoHome(); }} onCancel={() => setShowAlert(false)} mode="citizen" />
    </div>
  );
}