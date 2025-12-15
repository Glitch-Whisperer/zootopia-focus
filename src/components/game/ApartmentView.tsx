import { CharacterAvatar } from './CharacterAvatar';
import { CurrencyDisplay } from './CurrencyDisplay';
import { PlayerStats, CharacterType } from '@/types/game';
import { Smartphone, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApartmentViewProps {
  stats: PlayerStats;
  character: CharacterType;
  onOpenPhone: () => void;
}

const apartmentLevels = [
  { name: 'Grand Pangolin Arms', description: 'A modest start' },
  { name: 'Downtown Studio', description: 'Moving up!' },
  { name: 'Savanna Central Loft', description: 'Nice view!' },
  { name: 'Tundratown Condo', description: 'Cool living' },
  { name: 'Penthouse Suite', description: 'The pinnacle' },
];

export function ApartmentView({ stats, character, onOpenPhone }: ApartmentViewProps) {
  const apartment = apartmentLevels[stats.apartmentLevel - 1] || apartmentLevels[0];
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      {/* Window with city view */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-40 rounded-lg bg-primary/10 border border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/30 rounded-sm"
                style={{ height: `${20 + Math.random() * 40}px` }}
              />
            ))}
          </div>
        </div>
        {/* Stars */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-foreground/50 rounded-full animate-pulse"
            style={{ 
              top: `${10 + Math.random() * 30}%`, 
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">{apartment.name}</h1>
          <p className="text-sm text-muted-foreground">{apartment.description}</p>
        </div>
        <CurrencyDisplay stats={stats} />
      </header>

      {/* Main Content - Character */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Character Platform */}
        <div className="relative">
          {/* Glow under character */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-accent/20 blur-xl rounded-full" />
          
          <CharacterAvatar character={character} size="lg" />
        </div>

        {/* Quick Stats */}
        <div className="mt-8 flex gap-4">
          <div className="glass-panel px-4 py-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Focus Time</div>
              <div className="font-display text-lg">{stats.totalFocusMinutes} min</div>
            </div>
          </div>
          <div className="glass-panel px-4 py-3 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-rank" />
            <div>
              <div className="text-xs text-muted-foreground">Rank Progress</div>
              <div className="font-display text-lg">{stats.rankProgress}%</div>
            </div>
          </div>
        </div>
      </main>

      {/* Phone Button */}
      <footer className="relative z-10 p-6">
        <Button 
          onClick={onOpenPhone}
          className="w-full py-6 font-display text-lg gap-3 bg-card hover:bg-card/80 border border-border"
          variant="outline"
        >
          <Smartphone className="w-5 h-5" />
          Open Phone
        </Button>
      </footer>

      {/* Furniture decorations based on apartment level */}
      <div className="absolute bottom-32 left-8 opacity-50">
        {stats.apartmentLevel >= 2 && <div className="text-4xl">🪴</div>}
      </div>
      <div className="absolute bottom-32 right-8 opacity-50">
        {stats.apartmentLevel >= 3 && <div className="text-4xl">🛋️</div>}
      </div>
      <div className="absolute top-1/2 left-6 opacity-50">
        {stats.apartmentLevel >= 4 && <div className="text-3xl">🖼️</div>}
      </div>
    </div>
  );
}
