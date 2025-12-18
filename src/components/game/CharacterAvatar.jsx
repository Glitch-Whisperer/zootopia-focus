import foxImage from '@/assets/character-fox.png';
import bunnyImage from '@/assets/character-bunny.png';
import slothImage from '@/assets/character-sloth.png';

const characterImages = {
  fox: foxImage,
  bunny: bunnyImage,
  sloth: slothImage,
};

const characterNames = {
  fox: 'Nick',
  bunny: 'Judy',
  sloth: 'Flash',
};

const sizeClasses = {
  sm: 'w-20 h-28',
  md: 'w-32 h-44',
  lg: 'w-48 h-64',
  xl: 'w-64 h-80',
};

export function CharacterAvatar({ character, size = 'md', className = '', animate = true }) {
  return (
    <div className={`relative ${className}`}>
      {/* 3D Character glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-accent/20 to-transparent blur-3xl rounded-full scale-125" />
      
      {/* Ground shadow for 3D depth */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-foreground/20 blur-xl rounded-full" />
      
      {/* Character image with transparent background */}
      <div className={`relative ${animate ? 'animate-character-idle' : ''}`}>
        <img 
          src={characterImages[character]} 
          alt={characterNames[character]}
          className={`${sizeClasses[size]} object-contain relative z-10`}
          style={{ 
            filter: 'drop-shadow(0 15px 50px rgba(0,0,0,0.7)) drop-shadow(0 0 40px hsl(var(--primary) / 0.2))',
          }}
        />
      </div>
    </div>
  );
}