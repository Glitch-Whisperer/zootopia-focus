import { useState, useEffect } from 'react';
import { Map, Radio, Wallet, X, Snowflake, TreePine, Sun, Target, Clock, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import phoneDevice from '@/assets/phone-device.png';

type PhoneApp = 'main' | 'maps' | 'dispatch' | 'zpay';

const biomeData: { type; name: string; icon: typeof Snowflake; color: string; description: string }[] = [
  { type: 'tundra', name: 'Tundratown', icon: Snowflake, color: 'text-tundra', description: 'The Freeze - Don\'t exit or the ice cracks' },
  { type: 'rainforest', name: 'Rainforest District', icon: TreePine, color: 'text-rainforest', description: 'The Gondola - Ride higher every 25 mins' },
  { type: 'sahara', name: 'Sahara Square', icon: Sun, color: 'text-sahara', description: 'The Heat - Finish before it bursts' },
];

const timeOptions = [15, 25, 45, 60];

export function PhoneMenu({ isOpen, onClose, onStartCitizen, onStartZPD, onStartHustle, onOpenShop, stats }) {
  const [currentApp, setCurrentApp] = useState('main');
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [customTime, setCustomTime] = useState('');
  const [animationPhase, setAnimationPhase] = useState('closed');

  useEffect(() => {
    if (isOpen && animationPhase === 'closed') {
      setAnimationPhase('opening');
      setTimeout(() => setAnimationPhase('open'), 800);
    } else if (!isOpen && animationPhase === 'open') {
      setAnimationPhase('closing');
      setTimeout(() => setAnimationPhase('closed'), 500);
    }
  }, [isOpen, animationPhase]);

  const handleClose = () => {
    setAnimationPhase('closing');
    setTimeout(() => {
      setAnimationPhase('closed');
      onClose();
    }, 500);
  };

  const handleBiomeSelect = (biome) => {
    setSelectedBiome(biome);
  };

  const handleTimeSelect = (minutes) => {
    if (selectedBiome) {
      onStartCitizen(selectedBiome, minutes);
      setCurrentApp('main');
      setSelectedBiome(null);
    }
  };

  const handleCustomTimeSubmit = () => {
    const mins = parseInt(customTime);
    if (selectedBiome && mins > 0 && mins <= 180) {
      onStartCitizen(selectedBiome, mins);
      setCurrentApp('main');
      setSelectedBiome(null);
      setCustomTime('');
    }
  };

  const handleHustle = () => {
    const success = onStartHustle();
    if (!success) {
      alert('Not enough Bucks! You need 500 to bet.');
    }
  };

  if (animationPhase === 'closed') return null;

  const renderMainMenu = () => (
    <div className="flex flex-col gap-3 p-4">
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">Apps</h3>
      
      <button 
        onClick={() => setCurrentApp('maps')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-tundra/20 to-tundra/10 hover:from-tundra/30 hover:to-tundra/20 transition-all group border border-tundra/20"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tundra/40 to-tundra/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-tundra/20">
          <Map className="w-6 h-6 text-tundra" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Maps</div>
          <div className="text-sm text-muted-foreground">Go to Work</div>
        </div>
      </button>

      <button 
        onClick={() => setCurrentApp('dispatch')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 transition-all group border border-primary/20"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
          <Radio className="w-6 h-6 text-primary" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Dispatch</div>
          <div className="text-sm text-muted-foreground">Go on Duty</div>
        </div>
      </button>

      <button 
        onClick={() => setCurrentApp('zpay')}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-bucks/20 to-bucks/10 hover:from-bucks/30 hover:to-bucks/20 transition-all group border border-bucks/20"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bucks/40 to-bucks/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-bucks/20">
          <Wallet className="w-6 h-6 text-bucks" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Z-Pay</div>
          <div className="text-sm text-muted-foreground">The Hustle</div>
        </div>
      </button>

      <button 
        onClick={() => { handleClose(); setTimeout(onOpenShop, 600); }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-accent/20 to-accent/10 hover:from-accent/30 hover:to-accent/20 transition-all group border border-accent/20"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
          <ShoppingBag className="w-6 h-6 text-accent" />
        </div>
        <div className="text-left">
          <div className="font-display text-lg text-foreground">Shop</div>
          <div className="text-sm text-muted-foreground">Buy Furniture</div>
        </div>
      </button>
    </div>
  );

  const renderMapsApp = () => (
    <div className="flex flex-col gap-3 p-4">
      <button onClick={() => { setCurrentApp('main'); setSelectedBiome(null); }} className="self-start text-muted-foreground hover:text-foreground transition-colors font-display">
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
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group border`}
            style={{
              background: `linear-gradient(to right, hsl(var(--${biome.type}) / 0.2), hsl(var(--${biome.type}) / 0.1))`,
              borderColor: `hsl(var(--${biome.type}) / 0.2)`,
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ background: `linear-gradient(to bottom right, hsl(var(--${biome.type}) / 0.4), hsl(var(--${biome.type}) / 0.2))` }}
            >
              <biome.icon className={`w-6 h-6 ${biome.color}`} />
            </div>
            <div className="text-left flex-1">
              <div className="font-display text-lg text-foreground">{biome.name}</div>
              <div className="text-xs text-muted-foreground">{biome.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {timeOptions.map(mins => (
              <button
                key={mins}
                onClick={() => handleTimeSelect(mins)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-b from-muted to-muted/50 hover:from-muted/80 hover:to-muted/30 transition-all group border border-border/50"
              >
                <Clock className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform" />
                <span className="font-display text-2xl text-foreground">{mins}</span>
                <span className="text-xs text-muted-foreground">minutes</span>
              </button>
            ))}
          </div>
          
          {/* Custom Timer */}
          <div className="glass-panel p-4 space-y-3">
            <div className="text-sm text-muted-foreground text-center">Custom Duration</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="1-180"
                min="1"
                max="180"
                className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-center font-display text-lg focus:outline-none focus:border-primary/50"
              />
              <Button
                onClick={handleCustomTimeSubmit}
                disabled={!customTime || parseInt(customTime) <= 0 || parseInt(customTime) > 180}
                className="font-display"
              >
                Go
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDispatchApp = () => (
    <div className="flex flex-col gap-3 p-4">
      <button onClick={() => setCurrentApp('main')} className="self-start text-muted-foreground hover:text-foreground transition-colors font-display">
        ← Back
      </button>
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">ZPD Dispatch</h3>
      
      <div className="glass-panel p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="font-display text-lg">Case of the Week</div>
            <div className="text-sm text-muted-foreground">3-Stage Investigation</div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-tundra/10">
            <div className="w-3 h-3 rounded-full bg-tundra" />
            <span className="text-tundra">Stage 1: Gather Clues (25 min)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-rainforest/10">
            <div className="w-3 h-3 rounded-full bg-rainforest" />
            <span className="text-rainforest">Stage 2: The Chase (25 min)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-sahara/10">
            <div className="w-3 h-3 rounded-full bg-sahara" />
            <span className="text-sahara">Stage 3: The Arrest (25 min)</span>
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
      <button onClick={() => setCurrentApp('main')} className="self-start text-muted-foreground hover:text-foreground transition-colors font-display">
        ← Back
      </button>
      <h3 className="font-display text-xl text-center mb-2 text-foreground/90">The Hustle</h3>
      
      <div className="glass-panel p-4 space-y-4">
        <div className="text-center">
          <div className="font-display text-4xl text-bucks mb-2 animate-pulse-glow">500 → 1,000</div>
          <div className="text-sm text-muted-foreground">High Risk, High Reward</div>
        </div>
        
        <div className="bg-destructive/20 rounded-xl p-3 text-sm border border-destructive/30">
          <div className="font-semibold text-destructive mb-1">⚠️ Warning</div>
          <div className="text-destructive/80">Exit early = Lose ALL 500 Bucks instantly</div>
        </div>

        <div className="text-center text-muted-foreground">
          Your balance: <span className="text-bucks font-semibold">{stats.bucks} Bucks</span>
        </div>

        <Button 
          onClick={() => { handleHustle(); setCurrentApp('main'); }}
          className="w-full font-display bg-gradient-to-r from-bucks to-bucks/80 text-background hover:from-bucks/90 hover:to-bucks/70"
          disabled={stats.bucks < 500}
        >
          Bet 500 Bucks (60 min)
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${animationPhase === 'opening' || animationPhase === 'open' ? 'bg-background/90' : 'bg-transparent'} backdrop-blur-sm transition-all duration-500`}>
      {/* Phone device animation */}
      <div className={`relative transition-all duration-700 ease-out ${
        animationPhase === 'opening' ? 'animate-phone-open' :
        animationPhase === 'closing' ? 'animate-phone-close' :
        animationPhase === 'open' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        {/* Phone glow effect */}
        <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
        
        {/* Phone frame with screen */}
        <div className="relative">
          {/* Phone device background */}
          <div className="absolute -inset-4 pointer-events-none">
            <img 
              src={phoneDevice} 
              alt="Phone" 
              className="w-96 h-auto object-contain opacity-30 blur-sm"
            />
          </div>

          {/* Actual phone screen */}
          <div className="phone-screen w-80 max-h-[600px] overflow-hidden relative">
            {/* Phone Notch */}
            <div className="h-8 bg-gradient-to-b from-muted to-card flex items-center justify-center relative">
              <div className="w-20 h-1.5 bg-foreground/20 rounded-full" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50" />
            </div>
            
            {/* Phone Content */}
            <div className="relative min-h-[400px] bg-gradient-to-b from-card via-card/95 to-card overflow-y-auto max-h-[500px]">
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>

              <div className={animationPhase === 'open' ? 'animate-fade-in' : ''}>
                {currentApp === 'main' && renderMainMenu()}
                {currentApp === 'maps' && renderMapsApp()}
                {currentApp === 'dispatch' && renderDispatchApp()}
                {currentApp === 'zpay' && renderZPayApp()}
              </div>
            </div>

            {/* Phone Home Indicator */}
            <div className="h-8 bg-gradient-to-t from-muted to-card flex items-center justify-center">
              <div className="w-32 h-1 bg-foreground/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
