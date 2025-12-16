import { useEffect, useState } from 'react';

import trainPanorama from '@/assets/train-panorama.png';

const destinationLabels: Record<BiomeType | 'home', string> = {
  home: 'Grand Pangolin Arms',
  tundra: 'Tundratown',
  rainforest: 'Rainforest District',
  sahara: 'Sahara Square',
};

export function TrainTransition({ isVisible, destination, onComplete }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (!isVisible) {
      setPhase('enter');
      return;
    }

    // Phase 1: Enter (0.5s)
    const enterTimer = setTimeout(() => setPhase('travel'), 500);
    
    // Phase 2: Travel (3s)
    const travelTimer = setTimeout(() => setPhase('exit'), 3500);
    
    // Phase 3: Exit & Complete (0.5s)
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(travelTimer);
      clearTimeout(exitTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-background">
      {/* Panorama background that scrolls */}
      <div 
        className="absolute inset-0 w-[300%] h-full"
        style={{
          backgroundImage: `url(${trainPanorama})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: phase === 'travel' ? 'train-panorama 3s linear forwards' : 'none',
          transform: phase === 'enter' ? 'translateX(0)' : undefined,
        }}
      />

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />

      {/* Train window frame effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-card to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-card/80 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-card/80 to-transparent" />
      </div>

      {/* Window reflections */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-foreground/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-foreground/5 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Center content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 'travel' ? 'opacity-100' : 'opacity-0'}`}>
        {/* Train logo */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
            <span className="text-4xl">🚄</span>
          </div>
        </div>

        {/* Destination text */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
            Zootopia Express
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Next Stop
          </h2>
          <p className="font-display text-xl md:text-2xl text-primary">
            {destinationLabels[destination]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="mt-8 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-train-dots"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Fade overlays for enter/exit */}
      <div 
        className={`absolute inset-0 bg-background transition-opacity duration-500 ${
          phase === 'enter' ? 'opacity-100' : phase === 'exit' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
