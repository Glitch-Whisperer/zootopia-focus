import { useState } from 'react';
import foxImage from '../../assets/character-fox.png';
import bunnyImage from '../../assets/character-bunny.png';
import slothImage from '../../assets/character-sloth.png';

const characters = [
  {
    id: 'fox',
    name: 'Nick Wilde',
    image: foxImage,
    description: 'A sly hustler with a heart of gold',
    trait: 'Cunning & Charming',
  },
  {
    id: 'bunny',
    name: 'Judy Hopps',
    image: bunnyImage,
    description: 'First bunny officer of the ZPD',
    trait: 'Determined & Brave',
  },
  {
    id: 'sloth',
    name: 'Flash',
    image: slothImage,
    description: 'The fastest sloth at the DMV',
    trait: 'Patient & Precise',
  },
];

export function CharacterSelection({ onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (characterId) => {
    setSelectedId(characterId);
    setTimeout(() => {
      onSelect(characterId);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/20 via-background to-background relative overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-12 pb-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-tight animate-fade-in">
          Choose Your Character
        </h1>
        <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Who will you become in Zootopia?
        </p>
      </header>

      {/* Character Grid */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {characters.map((char, i) => {
            const isHovered = hoveredId === char.id;
            const isSelected = selectedId === char.id;
            
            return (
              <button
                key={char.id}
                onClick={() => handleSelect(char.id)}
                onMouseEnter={() => setHoveredId(char.id)}
                onMouseLeave={() => setHoveredId(null)}
                disabled={selectedId !== null}
                className={`
                  relative group rounded-3xl p-6 transition-all duration-500 transform
                  ${isSelected 
                    ? 'scale-110 z-20' 
                    : isHovered 
                      ? 'scale-105 z-10' 
                      : selectedId ? 'scale-95 opacity-40' : 'hover:scale-105'
                  }
                `}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Glow effect */}
                <div className={`
                  absolute inset-0 rounded-3xl transition-all duration-500
                  ${isSelected 
                    ? 'bg-primary/40 shadow-[0_0_80px_20px_hsl(var(--primary)/0.5)]' 
                    : isHovered 
                      ? 'bg-primary/20 shadow-[0_0_60px_10px_hsl(var(--primary)/0.3)]'
                      : 'bg-card/50'
                  }
                `} />
                
                <div className="relative glass-panel p-4 rounded-2xl overflow-hidden">
                  <div className={`
                    relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-xl
                    transition-all duration-500
                    ${isHovered || isSelected ? 'scale-105' : ''}
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/10" />
                    
                    {/* 3D shadow/depth effect */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-foreground/10 blur-xl rounded-full" />
                    
                    {/* Character image */}
                    <img 
                      src={char.image} 
                      alt={char.name}
                      className={`
                        relative z-10 w-full h-full object-contain
                        transition-all duration-500
                        ${isHovered || isSelected ? 'transform -translate-y-2' : ''}
                      `}
                      style={{ 
                        filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.6)) 
                                 drop-shadow(0 0 30px hsl(var(--primary) / ${isHovered || isSelected ? '0.4' : '0.1'}))`,
                      }}
                    />
                    
                    {/* Overlay glow on selection */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent animate-pulse" />
                    )}
                  </div>

                  {/* Character info */}
                  <div className="text-center">
                    <h2 className={`
                      font-display text-xl text-foreground mb-1 transition-all duration-300
                      ${isSelected ? 'text-primary text-glow-primary' : ''}
                    `}>
                      {char.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">{char.description}</p>
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {char.trait}
                    </span>
                  </div>
                </div>

                {/* Selection ring */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-3xl border-2 border-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer hint */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Click to select your character
        </p>
      </footer>
    </div>
  );
}