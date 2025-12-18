import { useState, useRef } from 'react';
import { CharacterAvatar } from './CharacterAvatar';
import { CurrencyDisplay } from './CurrencyDisplay';
import { furnitureItems } from './FurnitureShop';
import { RANK_LABELS } from '@/types/game.js';

import { Smartphone, Clock, TrendingUp, Star } from 'lucide-react';
import apartmentBg from '@/assets/apartment-bg.png';

const apartmentLevels = [
  { name: 'Grand Pangolin Arms', description: 'A modest start', stars: 1 },
  { name: 'Downtown Studio', description: 'Moving up!', stars: 2 },
  { name: 'Savanna Central Loft', description: 'Nice view!', stars: 3 },
  { name: 'Tundratown Condo', description: 'Cool living', stars: 4 },
  { name: 'Penthouse Suite', description: 'The pinnacle', stars: 5 },
];

export function ApartmentView({ stats, character, ownedFurniture = [], onOpenPhone }) {
  const apartment = apartmentLevels[stats.apartmentLevel - 1] || apartmentLevels[0];
  const [isPhoneAnimating, setIsPhoneAnimating] = useState(false);
  const characterRef = useRef(null);

  const handleOpenPhone = () => {
    setIsPhoneAnimating(true);
    // Wait for character animation to start lifting phone
    setTimeout(() => {
      onOpenPhone();
      setIsPhoneAnimating(false);
    }, 400);
  };

  // Get owned furniture items with positions
  const ownedFurnitureItems = furnitureItems.filter(
    item => ownedFurniture.includes(item.id) && item.position
  );
  
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

      {/* Furniture Decorations */}
      {ownedFurnitureItems.map((item) => (
        <div
          key={item.id}
          className="absolute z-10 animate-fade-in transition-all duration-500 hover:scale-110"
          style={{
            ...item.position,
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
          }}
        >
          <div className="relative group">
            <span className="text-4xl md:text-5xl block animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
              {item.emoji}
            </span>
            {/* Glow effect under furniture */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full blur-sm opacity-60 ${
              item.biome === 'tundra' ? 'bg-tundra' :
              item.biome === 'rainforest' ? 'bg-rainforest' :
              item.biome === 'sahara' ? 'bg-sahara' : 'bg-bucks'
            }`} />
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-xs bg-card/90 px-2 py-1 rounded whitespace-nowrap font-display">
                {item.name}
              </span>
            </div>
          </div>
        </div>
      ))}

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
        {/* Branding */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2 tracking-tight">
            FocusHabitat
          </h1>
          <p className="text-muted-foreground italic text-sm md:text-base">
            "It's called a hustle, sweetheart."
          </p>
        </div>

        {/* Character with phone animation */}
        <div ref={characterRef} className={`relative ${isPhoneAnimating ? 'phone-lift-animation' : ''}`}>
          <CharacterAvatar character={character} size="xl" />
          
          {/* Phone icon floating near character */}
          <button
            onClick={handleOpenPhone}
            className={`absolute bottom-4 right-0 group transition-all duration-300 ${
              isPhoneAnimating ? 'scale-125 -translate-y-8' : 'hover:scale-110'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-card/90 to-card/70 border border-border/50 backdrop-blur-xl shadow-lg flex items-center justify-center group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          </button>
        </div>

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
    </div>
  );
}