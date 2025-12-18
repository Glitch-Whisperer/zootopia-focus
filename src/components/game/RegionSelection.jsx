import { useState, useMemo } from "react";
import {
  MapPin,
  Wind,
  Sun,
  CloudRain,
  Briefcase,
  Lock,
  Clock,
  Flame,
  User,
  Leaf,
  Moon,
  Flower,
  Mountain,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// CONFIG
import {
  REGIONS as CONFIG_REGIONS,
  getCurrentRank,
  getNextRegion,
} from "@/config/regionsConfig";

// ASSET
import mapBg from "@/assets/zootopia-map.jpeg";

/* ---------------- VISUAL REGION LAYOUT ---------------- */

const VISUAL_REGIONS = [
  {
    id: "savanna-central",
    icon: Briefcase,
    color: "from-orange-400 to-yellow-500",
    top: "25%",
    left: "20%",
    width: "25%",
    height: "25%",
  },
  {
    id: "sahara-square",
    icon: Sun,
    color: "from-red-500 to-orange-600",
    top: "55%",
    left: "15%",
    width: "25%",
    height: "25%",
  },
  {
    id: "tundratown",
    icon: Wind,
    color: "from-cyan-400 to-blue-600",
    top: "10%",
    left: "55%",
    width: "25%",
    height: "30%",
  },
  {
    id: "rainforest",
    icon: CloudRain,
    color: "from-emerald-500 to-green-700",
    top: "45%",
    left: "60%",
    width: "20%",
    height: "25%",
  },
  {
    id: "bunnyburrow",
    icon: Leaf,
    color: "from-green-400 to-lime-500",
    top: "60%",
    left: "2%",
    width: "15%",
    height: "20%",
  },
  {
    id: "little-rodentia",
    icon: User,
    color: "from-purple-400 to-pink-500",
    top: "32%",
    left: "72%",
    width: "12%",
    height: "12%",
  },
  {
    id: "meadowlands",
    icon: Flower,
    color: "from-teal-400 to-green-400",
    top: "55%",
    left: "82%",
    width: "15%",
    height: "20%",
  },
  {
    id: "nocturnal",
    icon: Moon,
    color: "from-indigo-600 to-purple-800",
    top: "35%",
    left: "50%",
    width: "15%",
    height: "15%",
  },
  {
    id: "outback-island",
    icon: Mountain,
    color: "from-red-700 to-orange-800",
    top: "75%",
    left: "50%",
    width: "20%",
    height: "15%",
  },
];

/* ---------------- COMPONENT ---------------- */

export function RegionSelection({
  userStats = { totalFocusMinutes: 0, currentStreak: 0 },
  onSelect,
  onOpenProfile,
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  const regions = useMemo(() => {
    return VISUAL_REGIONS.map((visual) => {
      const config =
        CONFIG_REGIONS.find((c) => c.id === visual.id) || {};
      return {
        ...visual,
        ...config,
        name: config.name || visual.id,
        description: config.description || "Explore this district",
        unlockLevel: config.unlockLevel || 0,
      };
    });
  }, []);

  const currentRank = getCurrentRank(userStats.totalFocusMinutes);
  const nextRegion = getNextRegion(userStats.totalFocusMinutes);

  const isRegionUnlocked = (unlockLevel) =>
    userStats.totalFocusMinutes >= unlockLevel;

  const getProgressToNext = () => {
    if (!nextRegion) return 100;
    const prev = regions
      .filter((r) => r.unlockLevel <= userStats.totalFocusMinutes)
      .map((r) => r.unlockLevel);
    const base = prev.length ? Math.max(...prev) : 0;
    const total = nextRegion.unlockLevel - base;
    const progress = userStats.totalFocusMinutes - base;
    return total <= 0 ? 100 : Math.min((progress / total) * 100, 100);
  };

  const handleSelect = (region) => {
    if (!isRegionUnlocked(region.unlockLevel)) return;
    setIsExiting(true);
    setTimeout(() => onSelect(region.id), 800);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-black transition-all duration-1000 ${
        isExiting ? "scale-[2] opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* ---------------- HUD ---------------- */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Stat icon={Clock} value={userStats.totalFocusMinutes} label="Mins" />
            <Stat icon={Flame} value={userStats.currentStreak} label="Streak" />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onOpenProfile}
            className="rounded-full w-12 h-12 bg-black/40 border-white/10 hover:bg-white/10 backdrop-blur-md"
          >
            <User className="w-6 h-6 text-white" />
          </Button>
        </div>

        {nextRegion && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>Next: {nextRegion.name}</span>
                  <span>
                    {userStats.totalFocusMinutes}/{nextRegion.unlockLevel}
                  </span>
                </div>
                <Progress value={getProgressToNext()} className="h-1.5" />
              </div>
              <Lock className="w-4 h-4 text-white/50" />
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MAP ---------------- */}
      <img
        src={mapBg}
        alt="Map"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* ---------------- REGIONS ---------------- */}
      {regions.map((region) => {
        const unlocked = isRegionUnlocked(region.unlockLevel);
        const Icon = region.icon;

        return (
          <button
            key={region.id}
            onClick={() => handleSelect(region)}
            onMouseEnter={() => setHoveredRegion(region)}
            onMouseLeave={() => setHoveredRegion(null)}
            className="absolute"
            style={{
              top: region.top,
              left: region.left,
              width: region.width,
              height: region.height,
            }}
          >
            <div
              className={`w-full h-full rounded-full transition-all duration-500 ${
                unlocked
                  ? `bg-gradient-to-br ${region.color} opacity-0 hover:opacity-100 blur-xl`
                  : "bg-black/60"
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 rounded-full bg-black/70 text-white border border-white/20 flex gap-2 items-center">
                {unlocked ? <MapPin size={14} /> : <Lock size={14} />}
                {region.name}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- SMALL STAT COMPONENT ---------------- */

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3">
      <div className="bg-white/10 p-2 rounded-full">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-white font-bold leading-none">{value}</p>
        <p className="text-white/60 text-xs uppercase">{label}</p>
      </div>
    </div>
  );
}
