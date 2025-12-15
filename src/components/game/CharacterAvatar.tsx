import { CharacterType } from '@/types/game';

interface CharacterAvatarProps {
  character: CharacterType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const characterEmojis: Record<CharacterType, string> = {
  fox: '🦊',
  bunny: '🐰',
  sloth: '🦥',
};

const sizeClasses = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
};

export function CharacterAvatar({ character, size = 'md', className = '' }: CharacterAvatarProps) {
  return (
    <div className={`animate-float ${className}`}>
      <span className={`${sizeClasses[size]} select-none`} role="img" aria-label={character}>
        {characterEmojis[character]}
      </span>
    </div>
  );
}
