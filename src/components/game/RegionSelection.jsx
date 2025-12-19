import { useState, useMemo } from 'react';
import { 
  MapPin, Wind, Sun, CloudRain, Briefcase, 
  Lock, Clock, Flame, User, Leaf, Moon, Flower, Mountain 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// --- IMPORTS ---
import { REGIONS as CONFIG_REGIONS, getCurrentRank, getNextRegion } from '../../config/regionsConfig.js';
import { UserProfile } from '../Profile.jsx'; // Make sure UserProfile.jsx is in the same folder
import mapBg from '@/assets/zootopia-map.jpeg'; 

// --- 1. VISUAL CONFIGURATION (Map Coordinates) ---
const VISUAL_REGIONS = [
  {
    id: 'savanna-central', 
    icon: Briefcase,
    color: 'from-orange-400 to-yellow-500',
    top: '25%', left: '20%', width: '25%', height: '25%',
  },
  {
    id: 'sahara-square', 
    icon: Sun,
    color: 'from-red-500 to-orange-600',
    top: '55%', left: '15%', width: '25%', height: '25%',
  },
  {
    id: 'tundratown', 
    icon: Wind,
    color: 'from-cyan-400 to-blue-600',
    top: '10%', left: '55%', width: '25%', height: '30%',
  },
  {
    id: 'rainforest', 
    icon: CloudRain,
    color: 'from-emerald-500 to-green-700',
    top: '45%', left: '60%', width: '20%', height: '25%',
  },
  {
    id: 'bunnyburrow',
    icon: Leaf,
    color: 'from-green-400 to-lime-500',
    top: '60%', left: '2%', width: '15%', height: '20%'
  },
  {
    id: 'little-rodentia',
    icon: User,
    color: 'from-purple-400 to-pink-500',
    top: '32%', left: '72%', width: '12%', height: '12%'
  },
  {
    id: 'meadowlands',
    icon: Flower,
    color: 'from-teal-400 to-green-400',
    top: '55%', left: '82%', width: '15%', height: '20%'
  },
  {
    id: 'nocturnal',
    icon: Moon,
    color: 'from-indigo-600 to-purple-800',
    top: '35%', left: '50%', width: '15%', height: '15%'
  },
  {
    id: 'outback-island',
    icon: Mountain,
    color: 'from-red-700 to-orange-800',
    top: '75%', left: '50%', width: '20%', height: '15%'
  }
];

export function RegionSelection({ 
  userStats = { totalFocusMinutes: 0, currentStreak: 0 }, 
  onSelect 
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for Profile Modal

  // --- 2. LOGIC MERGING ---
  const regions = useMemo(() => {
    return VISUAL_REGIONS.map(visual => {
      const config = CONFIG_REGIONS.find(c => c.id === visual.id) || {};
      return {
        ...visual, 
        ...config,
        name: config.name || visual.id,
        unlockLevel: config.unlockLevel || 0
      };
    });
  }, []);

  const nextRegion = getNextRegion(userStats.totalFocusMinutes);

  const isRegionUnlocked = (unlockLevel) => {
    return userStats.totalFocusMinutes >= unlockLevel; 
  };

  const getProgressToNext = () => {
    if (!nextRegion) return 100;
    const prevLevels = regions
      .filter(r => r.unlockLevel <= userStats.totalFocusMinutes)
      .map(r => r.unlockLevel);
    const prevLevel = prevLevels.length > 0 ? Math.max(...prevLevels) : 0;
    const totalNeeded = nextRegion.unlockLevel - prevLevel;
    const currentProgress = userStats.totalFocusMinutes - prevLevel;
    if (totalNeeded <= 0) return 100;
    return Math.min((currentProgress / totalNeeded) * 100, 100);
  };

  const handleSelect = (region) => {
    if (!isRegionUnlocked(region.unlockLevel)) return;
    
    // Zoom effect then navigate
    setIsExiting(true);
    setTimeout(() => {
      onSelect(region.id);
    }, 800); 
  };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-black transition-all duration-1000 ${isExiting ? 'scale-[2] opacity-0' : 'scale-100 opacity-100'}`}>
      
      {/* --- HUD: STATS --- */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6 pointer-events-none">
        <div className="flex justify-between items-start">
          
          {/* Left: User Stats */}
          <div className="pointer-events-auto flex gap-3">
            <div className="glass-panel bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{userStats.totalFocusMinutes}</p>
                <p className="text-white/60 text-xs uppercase tracking-wider">Mins</p>
              </div>
            </div>
            
            <div className="glass-panel bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="bg-orange-500/20 p-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{userStats.currentStreak}</p>
                <p className="text-white/60 text-xs uppercase tracking-wider">Streak</p>
              </div>
            </div>
          </div>

          {/* Right: Profile Button */}
          <div className="pointer-events-auto">
             <Button
                variant="outline"
                size="icon"
                onClick={() => setIsProfileOpen(true)}
                className="rounded-full w-12 h-12 bg-black/40 border-white/10 hover:bg-white/10 backdrop-blur-md"
              >
                <User className="w-6 h-6 text-white" />
              </Button>
          </div>
        </div>

        {/* Center: Next Unlock Progress */}
        {nextRegion && (
          <div className="mt-4 max-w-md mx-auto pointer-events-auto">
            <div className="glass-panel bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-4 shadow-lg">
              <div className="flex flex-col flex-1">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>Next: {nextRegion.name}</span>
                  <span>{userStats.totalFocusMinutes} / {nextRegion.unlockLevel}</span>
                </div>
                <Progress value={getProgressToNext()} className="h-1.5 bg-white/20" indicatorClassName="bg-primary" />
              </div>
              <Lock className="w-4 h-4 text-white/50" />
            </div>
          </div>
        )}
      </div>

      {/* --- MAP CONTAINER --- */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={mapBg} 
          alt="Zootopia Map" 
          className="w-full h-full object-cover object-center"
        />
        
        {/* Dark overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${hoveredRegion ? 'opacity-60' : 'opacity-20'}`} />

        {/* --- INTERACTIVE HOTSPOTS --- */}
        {regions.map((region) => {
          const unlocked = isRegionUnlocked(region.unlockLevel);
          const isHovered = hoveredRegion?.id === region.id;

          return (
            <button
              key={region.id}
              onClick={() => handleSelect(region)}
              onMouseEnter={() => setHoveredRegion(region)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="absolute group focus:outline-none"
              style={{
                top: region.top,
                left: region.left,
                width: region.width,
                height: region.height,
                cursor: unlocked ? 'pointer' : 'not-allowed'
              }}
            >
              {/* Target Glow Area */}
              <div className={`
                w-full h-full rounded-full 
                transition-all duration-500
                ${unlocked 
                  ? `bg-gradient-to-br ${region.color} mix-blend-overlay blur-xl opacity-0 group-hover:opacity-100 group-hover:scale-110` 
                  : 'bg-black/50 mix-blend-multiply opacity-0 group-hover:opacity-100'
                }
              `} />
              
              {/* Floating Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 group-hover:-translate-y-4">
                 <div className={`
                   flex items-center gap-2 px-4 py-2 rounded-full 
                   backdrop-blur-md border shadow-lg
                   font-display transition-all duration-300
                   ${isHovered 
                      ? (unlocked ? 'scale-110 bg-white/90 text-black border-white' : 'scale-110 bg-gray-900/90 text-gray-400 border-gray-700') 
                      : 'scale-100 bg-black/60 text-white border-white/20'}
                 `}>
                   {unlocked ? <MapPin className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                   {region.name}
                 </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* --- PROFILE POPUP --- */}
      <UserProfile 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userStats={userStats}
      />

    </div>
  );
}