import { CharacterAvatar } from './CharacterAvatar';
import { CurrencyDisplay } from './CurrencyDisplay';
import { PlayerStats, CharacterType, RANK_LABELS } from '@/types/game';
import { Smartphone, Clock, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apartmentBg from '@/assets/apartment-bg.png';

interface ApartmentViewProps {
  stats: PlayerStats;
  character: CharacterType;
  onOpenPhone: () => void;
}

const apartmentLevels = [
  { name: 'Grand Pangolin Arms', description: 'A modest start', stars: 1 },
  { name: 'Downtown Studio', description: 'Moving up!', stars: 2 },
  { name: 'Savanna Central Loft', description: 'Nice view!', stars: 3 },
  { name: 'Tundratown Condo', description: 'Cool living', stars: 4 },
  { name: 'Penthouse Suite', description: 'The pinnacle', stars: 5 },
];

export function ApartmentView({ stats, character, onOpenPhone }: ApartmentViewProps) {
  const apartment = apartmentLevels[stats.apartmentLevel - 1] || apartmentLevels[0];
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full apartment background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${apartmentBg})` }}
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
      
      {/* Ambient light effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-primary/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="glass-panel px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-xl text-foreground">{apartment.name}</h1>
            <div className="flex">
              {Array.from({ length: apartment.stars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-bucks text-bucks" />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{apartment.description}</p>
        </div>
        <CurrencyDisplay stats={stats} />
      </header>

      {/* Main Content - Character */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Character */}
        <CharacterAvatar character={character} size="xl" />

        {/* Quick Stats */}
        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          <div className="glass-panel px-5 py-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Focus Time</div>
              <div className="font-display text-2xl text-foreground">{stats.totalFocusMinutes} min</div>
            </div>
          </div>
          
          <div className="glass-panel px-5 py-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rank/30 to-rank/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rank" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Rank Progress</div>
              <div className="font-display text-2xl text-foreground">{RANK_LABELS[stats.rank]}</div>
              <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rank to-rank/70 rounded-full transition-all duration-500"
                  style={{ width: `${stats.rankProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Phone Button */}
      <footer className="relative z-10 p-6">
        <Button 
          onClick={onOpenPhone}
          className="w-full py-7 font-display text-lg gap-3 bg-gradient-to-r from-card/90 to-card/70 hover:from-card hover:to-card/80 border border-border/50 backdrop-blur-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          variant="outline"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <span>Open Phone</span>
        </Button>
      </footer>
    </div>
  );
}
