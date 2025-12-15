import { CharacterType } from '@/types/game';
import foxImage from '@/assets/character-fox.png';
import bunnyImage from '@/assets/character-bunny.png';
import slothImage from '@/assets/character-sloth.png';

interface CharacterAvatarProps {
  character: CharacterType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const characterImages: Record<CharacterType, string> = {
  fox: foxImage,
  bunny: bunnyImage,
  sloth: slothImage,
};

const characterNames: Record<CharacterType, string> = {
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

export function CharacterAvatar({ character, size = 'md', className = '', animate = true }: CharacterAvatarProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Character glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/30 via-primary/20 to-transparent blur-3xl rounded-full scale-110" />
      
      {/* Character image */}
      <div className={`relative ${animate ? 'animate-character-idle' : ''}`}>
        <img 
          src={characterImages[character]} 
          alt={characterNames[character]}
          className={`${sizeClasses[size]} object-contain`}
          style={{ 
            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.6))',
          }}
        />
      </div>
    </div>
  );
}
