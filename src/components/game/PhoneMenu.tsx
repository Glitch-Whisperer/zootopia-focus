import { useState } from 'react';
import { Map, Radio, Wallet, X, Snowflake, TreePine, Sun, Target, Clock } from 'lucide-react';
import { BiomeType, GameMode, PlayerStats } from '@/types/game';
import { Button } from '@/components/ui/button';

interface PhoneMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCitizen: (biome: BiomeType, minutes: number) => void;
  onStartZPD: () => void;
  onStartHustle: () => boolean;
  stats: PlayerStats;
}

type PhoneApp = 'main' | 'maps' | 'dispatch' | 'zpay';

const biomeData: { type: BiomeType; name: string; icon: typeof Snowflake; color: string; description: string }[] = [
  { type: 'tundra', name: 'Tundratown', icon: Snowflake, color: 'text-tundra', description: 'The Freeze - Don\'t exit or the ice cracks' },
  { type: 'rainforest', name: 'Rainforest District', icon: TreePine, color: 'text-rainforest', description: 'The Gondola - Ride higher every 25 mins' },
  { type: 'sahara', name: 'Sahara Square', icon: Sun, color: 'text-sahara', description: 'The Heat - Finish before it bursts' },
];

const timeOptions = [15, 25, 45, 60];

export function PhoneMenu({ isOpen, onClose, onStartCitizen, onStartZPD, onStartHustle, stats }: PhoneMenuProps) {
  const [currentApp, setCurrentApp] = useState<PhoneApp>('main');
  const [selectedBiome, setSelectedBiome] = useState<BiomeType | null>(null);

  if (!isOpen) return null;

  const handleBiomeSelect = (biome: BiomeType) => {
    setSelectedBiome(biome);
  };

  const handleTimeSelect = (minutes: number) => {
    if (selectedBiome) {
      onStartCitizen(selectedBiome, minutes);
      setCurrentApp('main');
      setSelectedBiome(null);
    }
  };

  const handleHustle = () => {
    const success = onStartHustle();
    if (!success) {
      alert('Not enough Bucks! You need 500 to bet.');
    }
  };

  const renderMainMenu = () => (
    <div className="flex flex-col gap-3 p-4">
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">Apps</h3>
      
      <button 
        onClick={() => setCurrentApp('maps')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-tundra/20 hover:bg-tundra/30 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-tundra/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Map className="w-6 h-6 text-tundra" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Maps</div>
          <div className="text-sm text-muted-foreground">Go to Work</div>
        </div>
      </button>

      <button 
        onClick={() => setCurrentApp('dispatch')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-primary/20 hover:bg-primary/30 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Radio className="w-6 h-6 text-primary" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Dispatch</div>
          <div className="text-sm text-muted-foreground">Go on Duty</div>
        </div>
      </button>

      <button 
        onClick={() => setCurrentApp('zpay')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-bucks/20 hover:bg-bucks/30 transition-all group"
      >
        <div className="w-12 h-12 rounded-xl bg-bucks/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Wallet className="w-6 h-6 text-bucks" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Z-Pay</div>
          <div className="text-sm text-muted-foreground">The Hustle</div>
        </div>
      </button>
    </div>
  );

  const renderMapsApp = () => (
    <div className="flex flex-col gap-3 p-4">
      <button onClick={() => { setCurrentApp('main'); setSelectedBiome(null); }} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">
        {selectedBiome ? 'Select Duration' : 'Choose Biome'}
      </h3>
      
      {!selectedBiome ? (
        biomeData.map(biome => (
          <button
            key={biome.type}
            onClick={() => handleBiomeSelect(biome.type)}
            className={`flex items-center gap-4 p-4 rounded-2xl bg-${biome.type}/20 hover:bg-${biome.type}/30 transition-all group`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${biome.type}/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <biome.icon className={`w-6 h-6 ${biome.color}`} />
            </div>
            <div className="text-left flex-1">
              <div className="font-display text-lg text-foreground">{biome.name}</div>
              <div className="text-xs text-muted-foreground">{biome.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {timeOptions.map(mins => (
            <button
              key={mins}
              onClick={() => handleTimeSelect(mins)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-all group"
            >
              <Clock className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform" />
              <span className="font-display text-2xl text-foreground">{mins}</span>
              <span className="text-xs text-muted-foreground">minutes</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderDispatchApp = () => (
    <div className="flex flex-col gap-3 p-4">
      <button onClick={() => setCurrentApp('main')} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">ZPD Dispatch</h3>
      
      <div className="glass-panel p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          <div>
            <div className="font-display text-lg">Case of the Week</div>
            <div className="text-sm text-muted-foreground">3-Stage Investigation</div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tundra" />
            <span>Stage 1: Gather Clues (25 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rainforest" />
            <span>Stage 2: The Chase (25 min)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sahara" />
            <span>Stage 3: The Arrest (25 min)</span>
          </div>
        </div>

        <Button 
          onClick={() => { onStartZPD(); setCurrentApp('main'); }}
          className="w-full font-display"
          variant="default"
        >
          Accept Assignment
        </Button>
      </div>
    </div>
  );

  const renderZPayApp = () => (
    <div className="flex flex-col gap-3 p-4">
      <button onClick={() => setCurrentApp('main')} className="self-start text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">The Hustle</h3>
      
      <div className="glass-panel p-4 space-y-4">
        <div className="text-center">
          <div className="font-display text-4xl text-bucks mb-2">500 → 1,000</div>
          <div className="text-sm text-muted-foreground">High Risk, High Reward</div>
        </div>
        
        <div className="bg-destructive/20 rounded-xl p-3 text-sm">
          <div className="font-semibold text-destructive mb-1">⚠️ Warning</div>
          <div className="text-destructive/80">Exit early = Lose ALL 500 Bucks instantly</div>
        </div>

        <div className="text-center text-muted-foreground">
          Your balance: <span className="text-bucks font-semibold">{stats.bucks} Bucks</span>
        </div>

        <Button 
          onClick={() => { handleHustle(); setCurrentApp('main'); }}
          className="w-full font-display bg-bucks text-background hover:bg-bucks/90"
          disabled={stats.bucks < 500}
        >
          Bet 500 Bucks (60 min)
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="phone-screen w-80 max-h-[600px] overflow-hidden animate-scale-in">
        {/* Phone Notch */}
        <div className="h-8 bg-muted flex items-center justify-center">
          <div className="w-20 h-1 bg-border rounded-full" />
        </div>
        
        {/* Phone Content */}
        <div className="relative min-h-[400px]">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {currentApp === 'main' && renderMainMenu()}
          {currentApp === 'maps' && renderMapsApp()}
          {currentApp === 'dispatch' && renderDispatchApp()}
          {currentApp === 'zpay' && renderZPayApp()}
        </div>

        {/* Phone Home Indicator */}
        <div className="h-8 flex items-center justify-center">
          <div className="w-32 h-1 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
