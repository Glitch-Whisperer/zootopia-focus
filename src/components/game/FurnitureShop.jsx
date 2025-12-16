import { useState } from 'react';
import { X, Check, Lock, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';


const furnitureItems[] = [
  // Tundratown Collection
  { id: 'ice-lamp', name: 'Ice Crystal Lamp', cost: 200, biome: 'tundra', emoji: '💎', description: 'Glowing ice sculpture' },
  { id: 'polar-rug', name: 'Polar Bear Rug', cost: 350, biome: 'tundra', emoji: '🐻‍❄️', description: 'Cozy faux fur rug' },
  { id: 'snow-globe', name: 'Snow Globe', cost: 150, biome: 'tundra', emoji: '🔮', description: 'Mini Tundratown inside' },
  
  // Rainforest Collection
  { id: 'vine-plant', name: 'Hanging Vines', cost: 180, biome: 'rainforest', emoji: '🌿', description: 'Lush tropical plants' },
  { id: 'waterfall', name: 'Mini Waterfall', cost: 400, biome: 'rainforest', emoji: '💧', description: 'Soothing water feature' },
  { id: 'parrot-perch', name: 'Parrot Perch', cost: 250, biome: 'rainforest', emoji: '🦜', description: 'Exotic bird stand' },
  
  // Sahara Collection
  { id: 'cactus-lamp', name: 'Neon Cactus', cost: 220, biome: 'sahara', emoji: '🌵', description: 'Glowing desert plant' },
  { id: 'sand-art', name: 'Sand Art Display', cost: 300, biome: 'sahara', emoji: '🏜️', description: 'Flowing sand sculpture' },
  { id: 'camel-statue', name: 'Golden Camel', cost: 500, biome: 'sahara', emoji: '🐪', description: 'Luxurious decoration' },
  
  // Premium Collection
  { id: 'penthouse-key', name: 'Penthouse Key', cost: 2000, biome: 'tundra', emoji: '🗝️', description: 'Unlock luxury living' },
];

const biomeLabels: Record<BiomeType, { name: string; color: string }> = {
  tundra: { name: 'Tundratown', color: 'text-tundra' },
  rainforest: { name: 'Rainforest', color: 'text-rainforest' },
  sahara: { name: 'Sahara', color: 'text-sahara' },
};

export function FurnitureShop({ isOpen, onClose, stats, onPurchase, ownedItems }) {
  const [selectedBiome, setSelectedBiome] = useState('all');
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);

  if (!isOpen) return null;

  const filteredItems = selectedBiome === 'all' 
    ? furnitureItems 
    s.filter(item => item.biome === selectedBiome);

  const handlePurchase = (item) => {
    if (ownedItems.includes(item.id)) return;
    if (stats.bucks < item.cost) return;
    
    const success = onPurchase(item);
    if (success) {
      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="glass-panel p-4 rounded-b-none border-b-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bucks/40 to-bucks/20 flex items-center justify-center">
              <Home className="w-6 h-6 text-bucks" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground">Z-Pay Shop</h2>
              <p className="text-sm text-muted-foreground">Upgrade your apartment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="currency-badge currency-bucks">
              <span className="text-lg">{stats.bucks}</span>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Biome Filter */}
        <div className="glass-panel px-4 py-3 rounded-none border-y-0 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedBiome('all')}
            className={`px-4 py-2 rounded-full text-sm font-display transition-all whitespace-nowrap ${
              selectedBiome === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            All Items
          </button>
          {(['tundra', 'rainforest', 'sahara'] as BiomeType[]).map(biome => (
            <button
              key={biome}
              onClick={() => setSelectedBiome(biome)}
              className={`px-4 py-2 rounded-full text-sm font-display transition-all whitespace-nowrap ${
                selectedBiome === biome 
                  ? `bg-${biome}/30 ${biomeLabels[biome].color}` 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {biomeLabels[biome].name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="glass-panel p-4 rounded-t-none flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const owned = ownedItems.includes(item.id);
              const canAfford = stats.bucks >= item.cost;
              const isPurchasing = purchaseAnimation === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePurchase(item)}
                  disabled={owned || !canAfford}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    owned 
                      ? 'bg-primary/10 border-primary/30' 
                      : canAfford 
                        ? 'bg-card/50 border-border/50 hover:bg-card hover:border-border hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-muted/30 border-muted/20 opacity-60'
                  } ${isPurchasing ? 'animate-scale-in' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{item.emoji}</span>
                    {owned ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : !canAfford ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-bucks" />
                    )}
                  </div>
                  <div className="font-display text-sm text-foreground mb-1">{item.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                  <div className={`text-sm font-semibold ${owned ? 'text-primary' : canAfford ? 'text-bucks' : 'text-muted-foreground'}`}>
                    {owned ? 'Owned' : `${item.cost} Bucks`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
